import json
import boto3
import os
from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TENANT_RECORDS_TABLE'])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "")

    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps("Preflight OK")
        }

    if method != "POST":
        return {
            "statusCode": 405,
            "headers": CORS_HEADERS,
            "body": json.dumps({ "message": "Method Not Allowed" })
        }

    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email")
        name = body.get("name")
        apartment_id = body.get("apartment_id")

        if not all([email, name, apartment_id]):
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({ "message": "Missing email, name, or apartment_id" })
            }

        # Check if record already exists
        existing = table.get_item(Key={"email": email})
        if "Item" in existing:
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({ "message": "Tenant already exists." })
            }

        # Insert record
        table.put_item(Item={
            "email": email,
            "name": name,
            "apartment_id": apartment_id,
            "created_at": datetime.utcnow().isoformat()
        })

        return {
            "statusCode": 201,
            "headers": CORS_HEADERS,
            "body": json.dumps({ "message": "Tenant record added" })
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({ "message": "Internal Server Error", "error": str(e) })
        }
