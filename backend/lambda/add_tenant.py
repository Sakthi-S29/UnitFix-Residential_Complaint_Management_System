import json
import boto3
import os
from boto3.dynamodb.conditions import Key

# DynamoDB setup
dynamodb = boto3.resource('dynamodb')
units_table = dynamodb.Table(os.environ['UNITS_TABLE_NAME'])

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
}

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))  # Debug log

    method = event.get("requestContext", {}).get("http", {}).get("method", "")
    claims = event.get("requestContext", {}).get("authorizer", {}).get("jwt", {}).get("claims", {})
    apartment_id = claims.get("custom:apartment")

    if not apartment_id:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unauthorized"})
        }

    if method == "GET":
        try:
            response = units_table.query(
                KeyConditionExpression=Key('apartment_id').eq(apartment_id)
            )
            units = response.get("Items", [])
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(units)
            }
        except Exception as e:
            print("GET error:", str(e))
            return {
                "statusCode": 500,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "Failed to fetch units"})
            }

    elif method == "POST":
        try:
            body = json.loads(event.get("body", "{}"))
            unit_id = body.get("unit_id")
            tenant_email = body.get("email")

            if not unit_id or not tenant_email:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"message": "Missing unit_id or email"})
                }

            print(f"Adding {tenant_email} to unit {unit_id} in apartment {apartment_id}")

            # Update item: increment tenants count + append to tenant_emails list
            units_table.update_item(
                Key={
                    "apartment_id": apartment_id,
                    "unit_id": unit_id
                },
                UpdateExpression="""
                    SET 
                        tenants = if_not_exists(tenants, :zero) + :inc,
                        tenant_emails = list_append(if_not_exists(tenant_emails, :empty_list), :new_email)
                """,
                ExpressionAttributeValues={
                    ":inc": 1,
                    ":zero": 0,
                    ":empty_list": [],
                    ":new_email": [tenant_email]
                }
            )

            return {
                "statusCode": 201,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "✅ Tenant added to unit"})
            }

        except Exception as e:
            print("POST error:", str(e))
            return {
                "statusCode": 500,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": f"❌ Failed to add tenant: {str(e)}"})
            }

    return {
        "statusCode": 405,
        "headers": CORS_HEADERS,
        "body": json.dumps({"message": "Method Not Allowed"})
    }
