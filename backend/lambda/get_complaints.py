import json
import boto3
import os
from boto3.dynamodb.conditions import Attr

# Initialize DynamoDB resource and table
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get("TABLE_NAME", "UnitFix_Complaints")
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))  # Full event logging

        # Extract query parameters
        query_params = event.get("queryStringParameters", {})
        unit_id = query_params.get("unit_id")
        apartment = query_params.get("apartment")

        if not (unit_id and apartment):
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": True
                },
                "body": json.dumps({"error": "Missing unit_id or apartment in query parameters"})
            }

        print(f"Scanning for unit_id={unit_id}, apartment={apartment}")

        # Perform a filtered scan by unit and apartment only
        response = table.scan(
            FilterExpression=Attr("unit_id").eq(unit_id) & Attr("apartment").eq(apartment)
        )

        print("Scan result:", response)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps(response.get("Items", []))
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
