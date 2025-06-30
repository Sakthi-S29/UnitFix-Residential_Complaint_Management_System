import json
import boto3
import uuid
from datetime import datetime
import base64
import os
import mimetypes

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

TABLE_NAME = "UnitFix_Complaints"
BUCKET_NAME = os.environ.get("ATTACHMENT_BUCKET")

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])

        complaint_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        # Extract details
        subject = body.get('subject')
        complaint_type = body.get('type')
        concern = body.get('concern')
        anonymous = body.get('anonymous', False)
        apartment = body.get('apartment')
        unit_id = body.get('unit_id')
        submitted_by = body.get('submitted_by', 'anonymous')

        # Handle optional file (base64)
        file_url = None
        if 'file_data' in body and 'file_name' in body:
            original_file_name = body['file_name']
            file_name = f"{complaint_id}_{original_file_name}"
            file_bytes = base64.b64decode(body['file_data'])

            # Guess MIME type
            mime_type, _ = mimetypes.guess_type(original_file_name)
            mime_type = mime_type or "application/octet-stream"

            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=file_name,
                Body=file_bytes,
                ContentType=mime_type,
                ContentDisposition="inline"
            )

            file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"

        # Store in DynamoDB
        table = dynamodb.Table(TABLE_NAME)
        table.put_item(Item={
            "complaint_id": complaint_id,
            "apartment": apartment,
            "unit_id": unit_id,
            "subject": subject,
            "type": complaint_type,
            "concern": concern,
            "anonymous": anonymous,
            "attachment_url": file_url or "",
            "status": "Pending",
            "timestamp": timestamp,
            "submitted_by": submitted_by
        })

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Complaint submitted successfully."})
        }

    except Exception as e:
        print("❌ Error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error submitting complaint."})
        }
