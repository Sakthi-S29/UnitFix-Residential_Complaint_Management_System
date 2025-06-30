import boto3
import os
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TENANT_RECORDS_TABLE'])

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

    params = event.get("queryStringParameters", {})
    email = params.get("email")

    if not email:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Missing email"})
        }

    try:
        response = table.get_item(Key={"email": email})
        item = response.get("Item", {})

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "name": item.get("name", "Unknown"),
                "email": email
            })
        }

    except Exception as e:
        print("Error:", e)
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Error retrieving tenant"})
        }
