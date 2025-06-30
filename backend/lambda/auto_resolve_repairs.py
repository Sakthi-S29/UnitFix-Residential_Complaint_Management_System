import boto3
import os
from datetime import datetime
import pytz

dynamodb = boto3.resource("dynamodb")
repairs_table = dynamodb.Table(os.environ["REPAIRS_TABLE"])
complaints_table = dynamodb.Table(os.environ["COMPLAINTS_TABLE"])

def lambda_handler(event, context):
    try:
        # Scan all scheduled repairs
        response = repairs_table.scan()
        repairs = response.get("Items", [])

        now = datetime.now(pytz.UTC)

        updated = 0

        for repair in repairs:
            date = repair.get("scheduled_date")
            time = repair.get("scheduled_time")
            complaint_id = repair.get("complaint_id")

            if not date or not time or not complaint_id:
                continue

            # Combine date + time as UTC datetime
            dt_str = f"{date} {time}"
            scheduled_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
            scheduled_dt = pytz.UTC.localize(scheduled_dt)

            if scheduled_dt < now:
                # Update status to Resolved
                complaints_table.update_item(
                    Key={"complaint_id": complaint_id},
                    UpdateExpression="SET #s = :resolved",
                    ExpressionAttributeNames={"#s": "status"},
                    ExpressionAttributeValues={":resolved": "Resolved"}
                )
                updated += 1

        return {
            "statusCode": 200,
            "body": f"{updated} complaints marked as Resolved."
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }
