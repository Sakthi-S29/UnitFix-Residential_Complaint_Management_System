import json
import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

TABLE_NAME = os.environ.get("COMPLAINTS_TABLE")
BUCKET_NAME = os.environ.get("ATTACHMENT_BUCKET")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def lambda_handler(event, context):
    try:
        # Handle empty or missing body
        if not event.get("body"):
            raise ValueError("Missing request body")

        # Parse JSON body
        body = json.loads(event["body"])
        complaint_id = body.get("complaint_id")

        if not complaint_id:
            raise ValueError("Missing complaint_id in body")

        # Fetch from DynamoDB
        table = dynamodb.Table(TABLE_NAME)
        res = table.get_item(Key={'complaint_id': complaint_id})

        if 'Item' not in res or 'attachment_url' not in res['Item'] or not res['Item']['attachment_url']:
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "No attachment found"})
            }

        # Extract file key from the attachment_url
        url = res['Item']['attachment_url']
        key = url.split(f"{BUCKET_NAME}.s3.amazonaws.com/")[1]

        # Generate presigned URL
        signed_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': key},
            ExpiresIn=300  # 5 minutes
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"url": signed_url})
        }

    except ValueError as ve:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": str(ve)})
        }

    except Exception as e:
        print("❌ Error:", str(e))
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Error generating URL"})
        }
