resource "aws_dynamodb_table" "tenant_records" {
  name           = "TenantRecords"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Project     = "UnitFix"
  }
}

resource "aws_lambda_function" "add_tenant" {
  function_name = "add_tenant_record"
  runtime       = "python3.12"
  handler       = "add_tenant_record.lambda_handler"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout       = 10

  filename         = "${path.module}/../backend/lambda/add_tenant_record.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/add_tenant_record.zip")

  environment {
    variables = {
      TENANT_RECORDS_TABLE = aws_dynamodb_table.tenant_records.name
    }
  }

  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_integration" "add_tenant_record_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.add_tenant.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "add_tenant_record_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "POST /add-tenant-record"
  target    = "integrations/${aws_apigatewayv2_integration.add_tenant_record_integration.id}"
}

resource "aws_lambda_permission" "allow_apigw_add_tenant" {
  statement_id  = "AllowAPIGatewayInvokeAddTenant"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_tenant.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
