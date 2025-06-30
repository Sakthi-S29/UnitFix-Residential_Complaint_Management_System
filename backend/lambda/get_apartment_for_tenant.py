import json
import boto3
import os
from boto3.dynamodb.conditions import Attr
from decimal import Decimal

# Get table name from environment variable
TABLE_NAME = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

# Helper to convert Decimal to float/int
def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj) if '.' in str(obj) else int(obj)
    else:
        return obj

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        email = body.get('email')

        if not email:
            return {
                'statusCode': 400,
                'headers': {"Access-Control-Allow-Origin": "*"},
                'body': json.dumps({'message': 'Missing email in request.'})
            }

        response = table.scan(
            FilterExpression=Attr('tenant_emails').contains(email)
        )

        items = response.get('Items', [])
        if not items:
            return {
                'statusCode': 404,
                'headers': {"Access-Control-Allow-Origin": "*"},
                'body': json.dumps({'message': 'Email not found in any unit.'})
            }

        matched = convert_decimals(items[0])  # Convert Decimal types

        return {
            'statusCode': 200,
            'headers': {"Access-Control-Allow-Origin": "*"},
            'body': json.dumps({
                'apartment_id': matched['apartment_id'],
                'unit_id': matched['unit_id'],
                'status': matched.get('status'),
                'tenants': matched.get('tenants'),
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {"Access-Control-Allow-Origin": "*"},
            'body': json.dumps({'message': 'Server error', 'error': str(e)})
        }
