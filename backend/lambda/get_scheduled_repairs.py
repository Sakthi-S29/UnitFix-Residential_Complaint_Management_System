import json
import boto3
import os
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource("dynamodb")
repairs_table = dynamodb.Table(os.environ["REPAIRS_TABLE"])
complaints_table = dynamodb.Table(os.environ["COMPLAINTS_TABLE"])

def lambda_handler(event, context):
    try:
        params = event.get("queryStringParameters", {})
        unit_id = params.get("unit_id")
        apartment = params.get("apartment")

        if not unit_id or not apartment:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": True
                },
                "body": json.dumps({"error": "Missing unit_id or apartment"})
            }

        # Step 1: Get all complaints matching unit_id + apartment
        complaints_resp = complaints_table.scan(
            FilterExpression=Attr("unit_id").eq(unit_id) & Attr("apartment").eq(apartment)
        )
        complaints = complaints_resp.get("Items", [])
        complaint_map = {c["complaint_id"]: c for c in complaints}

        if not complaint_map:
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": True
                },
                "body": json.dumps([])
            }

        # Step 2: Get all scheduled repairs where complaint_id in above
        repairs_resp = repairs_table.scan()
        repairs = repairs_resp.get("Items", [])

        matching_repairs = []
        for r in repairs:
            cid = r.get("complaint_id")
            if cid in complaint_map:
                c = complaint_map[cid]
                matching_repairs.append({
                    "repair_id": r.get("repair_id"),
                    "complaint_id": cid,
                    "subject": c.get("subject"),
                    "scheduled_date": r.get("scheduled_date"),
                    "scheduled_time": r.get("scheduled_time"),
                    "reply": r.get("reply"),
                    "technician": r.get("technician"),
                    "unit_id": c.get("unit_id"),
                    "apartment": c.get("apartment")
                })

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps(matching_repairs)
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": str(e)})
        }
