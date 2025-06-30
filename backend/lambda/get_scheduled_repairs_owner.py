import json
import boto3
import os
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
repairs_table = dynamodb.Table(os.environ['REPAIRS_TABLE'])
complaints_table = dynamodb.Table(os.environ['COMPLAINTS_TABLE'])

def lambda_handler(event, context):
    try:
        apartment = event.get('queryStringParameters', {}).get('apartment')
        if not apartment:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing apartment in request'})
            }

        # Step 1: Scan all repairs
        response = repairs_table.scan()
        scheduled_repairs = response.get('Items', [])

        enriched_repairs = []

        for repair in scheduled_repairs:
            complaint_id = repair.get('complaint_id')

            if not complaint_id:
                continue

            # Fetch complaint info to get apartment + unit + tenant
            complaint_resp = complaints_table.get_item(Key={'complaint_id': complaint_id})
            complaint = complaint_resp.get('Item')

            if not complaint or complaint.get('apartment') != apartment:
                continue

            enriched_repairs.append({
                'repair_id': repair.get('repair_id'),
                'subject': complaint.get('subject'),
                'unit_id': complaint.get('unit_id'),
                'tenant': complaint.get('tenant'),
                'scheduled_date': repair.get('scheduled_date'),
                'scheduled_time': repair.get('scheduled_time'),
                'technician': repair.get('technician'),
                'status': repair.get('reply', 'Scheduled'),
                'notes': repair.get('notes', '')
            })

        return {
            'statusCode': 200,
            'body': json.dumps(enriched_repairs)
        }

    except Exception as e:
        print("❌ Error in get_scheduled_repairs_owner:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'})
        }
