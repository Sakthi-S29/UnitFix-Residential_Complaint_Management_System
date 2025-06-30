# --------------------------------------------
# HTTP API Gateway for UnitFix
# --------------------------------------------
resource "aws_apigatewayv2_api" "unitfix_api" {
  name          = "UnitFix-API"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token"]
    expose_headers = ["content-type"]
    max_age        = 3600
  }
}

# --------------------------------------------
# Default Stage for API Gateway
# --------------------------------------------
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.unitfix_api.id
  name        = "$default"
  auto_deploy = true
}

# --------------------------------------------
# Lambda Integration with API Gateway
# --------------------------------------------
resource "aws_apigatewayv2_integration" "manage_units_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.manage_units_function.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# --------------------------------------------
# Cognito JWT Authorizer
# --------------------------------------------
resource "aws_apigatewayv2_authorizer" "cognito_authorizer" {
  api_id           = aws_apigatewayv2_api.unitfix_api.id
  name             = "CognitoJWTAuthorizer"
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.unitfix_user_pool_client.id]
    issuer   = "https://${aws_cognito_user_pool.unitfix_user_pool.endpoint}"
  }
}

# --------------------------------------------
# POST /units Route
# --------------------------------------------
resource "aws_apigatewayv2_route" "post_units_route" {
  api_id             = aws_apigatewayv2_api.unitfix_api.id
  route_key          = "POST /units"
  target             = "integrations/${aws_apigatewayv2_integration.manage_units_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

# --------------------------------------------
# GET /units Route
# --------------------------------------------
resource "aws_apigatewayv2_route" "get_units_route" {
  api_id             = aws_apigatewayv2_api.unitfix_api.id
  route_key          = "GET /units"
  target             = "integrations/${aws_apigatewayv2_integration.manage_units_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

# --------------------------------------------
# DELETE /units/{id} Route
# --------------------------------------------
resource "aws_apigatewayv2_route" "delete_unit_route" {
  api_id             = aws_apigatewayv2_api.unitfix_api.id
  route_key          = "DELETE /units/{id}"
  target             = "integrations/${aws_apigatewayv2_integration.manage_units_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

# --------------------------------------------
# Lambda Permission for API Gateway to Invoke
# --------------------------------------------
resource "aws_lambda_permission" "api_gateway_invoke_lambda" {
  statement_id  = "AllowAPIGatewayInvokeManageUnits"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.manage_units_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
