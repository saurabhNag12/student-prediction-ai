# AWS Lambda Function (Python 3.12)
# Triggered by API Gateway to invoke SageMaker Endpoint

import os
import io
import boto3
import json

# Grab the endpoint name from environment variables
ENDPOINT_NAME = os.environ['SAGEMAKER_ENDPOINT_NAME']
runtime = boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    try:
        # Parse incoming JSON from API Gateway
        body = json.loads(event['body'])
        
        # Prepare data for SageMaker (CSV format)
        # Sequence: attendance, study_hours, assignment_score, internal_marks, previous_sem_score
        payload = f"{body['attendance']},{body['study_hours']},{body['assignment_score']},{body['internal_marks']},{body['previous_sem_score']}"
        
        # Invoke SageMaker Endpoint
        response = runtime.invoke_endpoint(
            EndpointName=ENDPOINT_NAME,
            ContentType='text/csv',
            Body=payload
        )
        
        # Parse response
        result = response['Body'].read().decode()
        
        # Respond back to API Gateway
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', # CORS
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'performance': result.strip('[]" \n'),
                'confidence': 92, # Example static value or implement probability in script
                'improvement_tip': "Maintain consistency and focus on weak subjects."
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
