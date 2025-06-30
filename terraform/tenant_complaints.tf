resource "aws_dynamodb_table" "unitfix_complaints" {
  name           = "UnitFix_Complaints"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "complaint_id"

  attribute {
    name = "complaint_id"
    type = "S"
  }

  tags = {
    Environment = "UnitFix"
    Purpose     = "TenantComplaints"
  }
}

resource "aws_s3_bucket" "attachments_bucket" {
  bucket = "unitfix-complaint-attachments-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_lambda_function" "submit_complaint" {
  filename         = "${path.module}/../backend/lambda/submit_complaint.zip"
  function_name    = "submit_complaint"
  handler          = "submit_complaint.lambda_handler"
  runtime          = "python3.10"
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/submit_complaint.zip")

  environment {
    variables = {
      ATTACHMENT_BUCKET = aws_s3_bucket.attachments_bucket.bucket
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}


# API Gateway route
resource "aws_apigatewayv2_integration" "submit_complaint_integration" {
  api_id           = aws_apigatewayv2_api.unitfix_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.submit_complaint.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "submit_complaint_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "POST /submit-complaint"
  target    = "integrations/${aws_apigatewayv2_integration.submit_complaint_integration.id}"
}

resource "aws_lambda_permission" "api_gateway_submit_complaint" {
  statement_id  = "AllowExecutionFromAPIGatewaySubmitComplaint"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submit_complaint.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}

resource "aws_s3_bucket_lifecycle_configuration" "attachments_lifecycle" {
  bucket = aws_s3_bucket.attachments_bucket.id

  rule {
    id     = "attachments-storage-transition"
    status = "Enabled"

    filter {
      prefix = "" # Apply to all objects
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "DEEP_ARCHIVE"
    }

    expiration {
      days = 365 # Optional: Auto-delete after 1 year
    }
  }
}
