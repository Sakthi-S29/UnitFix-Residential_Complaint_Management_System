# --------------------------------------------
# Lambda: Get All Units
# --------------------------------------------
resource "aws_lambda_function" "get_units_lambda" {
  function_name = "get_units"
  filename      = "../backend/lambda/get_all_units.zip"
  handler       = "get_all_units.lambda_handler"
  runtime       = "python3.12"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  source_code_hash = filebase64sha256("../backend/lambda/get_all_units.zip")

  environment {
    variables = {
      UNITS_TABLE = aws_dynamodb_table.unitfix_units.name
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

# --------------------------------------------
# Lambda: Get Tenant by Email
# --------------------------------------------
resource "aws_lambda_function" "get_tenant_by_email_lambda" {
  function_name = "get_tenant_by_email"
  filename      = "../backend/lambda/get_tenant_by_email.zip"
  handler       = "get_tenant_by_email.lambda_handler"
  runtime       = "python3.12"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  source_code_hash = filebase64sha256("../backend/lambda/get_tenant_by_email.zip")

  environment {
    variables = {
      TENANT_RECORDS_TABLE = aws_dynamodb_table.tenant_records.name
    }
  }
}

# --------------------------------------------
# Integration: Get Units
# --------------------------------------------
resource "aws_apigatewayv2_integration" "get_units_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_units_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# --------------------------------------------
# Integration: Get Tenant by Email
# --------------------------------------------
resource "aws_apigatewayv2_integration" "get_tenant_by_email_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_tenant_by_email_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# --------------------------------------------
# Route: GET /tenant-records (JWT Protected)
# --------------------------------------------
resource "aws_apigatewayv2_route" "get_tenant_by_email_route" {
  api_id             = aws_apigatewayv2_api.unitfix_api.id
  route_key          = "GET /tenant-records"
  target             = "integrations/${aws_apigatewayv2_integration.get_tenant_by_email_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

# --------------------------------------------
# Permission: Allow API Gateway to invoke get_units_lambda
# --------------------------------------------
resource "aws_lambda_permission" "allow_get_units_api" {
  statement_id  = "AllowAPIGatewayInvokeGetUnits"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_units_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/GET/units"
}

# --------------------------------------------
# Permission: Allow API Gateway to invoke get_tenant_by_email_lambda
# --------------------------------------------
resource "aws_lambda_permission" "allow_get_tenant_by_email_api" {
  statement_id  = "AllowAPIGatewayInvokeGetTenantByEmail"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_tenant_by_email_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/GET/tenant-records"
}
