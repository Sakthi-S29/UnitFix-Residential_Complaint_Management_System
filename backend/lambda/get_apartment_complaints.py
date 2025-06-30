import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
complaints_table = dynamodb.Table(os.environ['COMPLAINTS_TABLE_NAME'])

def lambda_handler(event, context):
    try:
        apartment = event['queryStringParameters'].get('apartment')

        if not apartment:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": "Missing 'apartment' parameter"})
            }

        response = complaints_table.scan()
        all_items = response.get("Items", [])

        filtered_complaints = [item for item in all_items if item.get("apartment") == apartment]

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(filtered_complaints)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }
