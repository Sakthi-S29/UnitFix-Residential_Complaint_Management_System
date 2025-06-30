# --------------------------------------------------------
# Lambda Function: addTenantFunction
# --------------------------------------------------------
resource "aws_lambda_function" "add_tenant_lambda" {
  function_name = "addTenantFunction"
  runtime       = "python3.12"
  handler       = "add_tenant.lambda_handler"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout       = 10

  filename         = "${path.module}/../backend/lambda/add_tenant.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/add_tenant.zip")

  environment {
    variables = {
      UNITS_TABLE_NAME = aws_dynamodb_table.unitfix_units.name
    }
  }

  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

# --------------------------------------------------------
# API Gateway Integration for addTenantFunction
# --------------------------------------------------------
resource "aws_apigatewayv2_integration" "add_tenant_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.add_tenant_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

# --------------------------------------------------------
# Route: POST /units/add-tenant (with JWT Auth)
# --------------------------------------------------------
resource "aws_apigatewayv2_route" "add_tenant_route" {
  api_id             = aws_apigatewayv2_api.unitfix_api.id
  route_key          = "POST /units/add-tenant"
  target             = "integrations/${aws_apigatewayv2_integration.add_tenant_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

# --------------------------------------------------------
# Lambda Permission for API Gateway to invoke addTenantFunction
# --------------------------------------------------------
resource "aws_lambda_permission" "allow_apigw_invoke_add_tenant" {
  statement_id  = "AllowExecutionFromApiGatewayAddTenant"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_tenant_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/POST/units/add-tenant"
}
