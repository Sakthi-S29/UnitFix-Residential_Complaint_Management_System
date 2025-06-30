import json
import uuid
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
complaints_table = dynamodb.Table(os.environ["COMPLAINTS_TABLE"])
repairs_table = dynamodb.Table(os.environ["REPAIRS_TABLE"])

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])

        # Extract fields from body
        complaint_id = body["complaint_id"]
        scheduled_date = body["scheduled_date"]
        scheduled_time = body["scheduled_time"]
        notes = body.get("notes", "")
        technician = body["technician"]
        reply = body["reply"]
        new_status = body["new_status"]

        # Step 1: Insert into ScheduledRepairs
        repair_id = str(uuid.uuid4())
        repair_item = {
            "repair_id": repair_id,
            "complaint_id": complaint_id,
            "scheduled_date": scheduled_date,
            "scheduled_time": scheduled_time,
            "technician": technician,
            "reply": reply,
            "notes": notes,
            "created_at": datetime.utcnow().isoformat()
        }

        repairs_table.put_item(Item=repair_item)

        # Step 2: Update status in Complaints
        complaints_table.update_item(
            Key={"complaint_id": complaint_id},
            UpdateExpression="SET #s = :new_status",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={":new_status": new_status}
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({
                "message": "Repair scheduled and complaint status updated.",
                "repair_id": repair_id
            })
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
    