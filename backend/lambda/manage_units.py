import json
import boto3
import os
import decimal

# Helper class to convert DynamoDB Decimals into JSON-serializable types
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

# Set up DynamoDB table
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('UNITS_TABLE_NAME')
table = dynamodb.Table(table_name)

# CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
}

def lambda_handler(event, context):
    method = event["requestContext"]["http"]["method"]
    path = event["requestContext"]["http"]["path"]

    # Extract apartment_id from JWT claims
    claims = event.get("requestContext", {}).get("authorizer", {}).get("jwt", {}).get("claims", {})
    apartment_id = claims.get("custom:apartment")

    if not apartment_id:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unauthorized"})
        }

    # GET - List all units
    if method == "GET":
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('apartment_id').eq(apartment_id)
        )
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(response.get("Items", []), cls=DecimalEncoder)
        }

    # POST - Add a unit
    elif method == "POST":
        body = json.loads(event.get("body", "{}"))
        unit = {
            "apartment_id": apartment_id,
            "unit_id": body["unit_id"],
            "status": body["status"],
            "tenants": body["tenants"]
        }
        table.put_item(Item=unit)
        return {
            "statusCode": 201,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unit added"})
        }

    # DELETE - Remove a unit
    elif method == "DELETE":
        unit_id = event["pathParameters"]["id"]
        table.delete_item(
            Key={
                "apartment_id": apartment_id,
                "unit_id": unit_id
            }
        )
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unit deleted"})
        }

    # Method not allowed
    else:
        return {
            "statusCode": 405,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Method Not Allowed"})
        }
