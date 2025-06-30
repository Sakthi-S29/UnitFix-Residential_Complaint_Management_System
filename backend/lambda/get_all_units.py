import boto3
import os
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['UNITS_TABLE'])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def lambda_handler(event, context):
    if event.get("requestContext", {}).get("http", {}).get("method", "") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps("Preflight OK")
        }

    try:
        response = table.scan()
        items = response.get('Items', [])

        simplified = [{
            "apartment_id": item["apartment_id"],
            "unit_id": item["unit_id"],
            "tenant_emails": item.get("tenant_emails", [])
        } for item in items]

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(simplified)
        }

    except Exception as e:
        print("Error:", e)
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Failed to fetch units"})
        }
