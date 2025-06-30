import boto3
import json
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get("TABLE_NAME"))

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "*"
}

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))

    method = event.get("requestContext", {}).get("http", {}).get("method", "")

    # Handle CORS preflight
    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps("CORS preflight success")
        }

    if method == "GET":
        try:
            response = table.scan()
            items = response.get("Items", [])

            seen = set()
            apartments = []
            for item in items:
                apt_id = item.get("apartment_id")
                if apt_id and apt_id not in seen:
                    seen.add(apt_id)
                    apartments.append({
                        "id": apt_id,
                        "name": apt_id.replace("_", " ").title()
                    })

            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(apartments)
            }

        except Exception as e:
            print("GET error:", str(e))
            return {
                "statusCode": 500,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "Failed to fetch apartments"})
            }

    return {
        "statusCode": 405,
        "headers": CORS_HEADERS,
        "body": json.dumps({"message": "Method Not Allowed"})
    }
