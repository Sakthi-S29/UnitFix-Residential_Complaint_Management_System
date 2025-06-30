resource "aws_lambda_function" "get_apartment_for_tenant" {
  function_name = "get_apartment_for_tenant"
  handler       = "get_apartment_for_tenant.lambda_handler"
  runtime       = "python3.12"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout       = 10

  filename         = "${path.module}/../backend/lambda/get_apartment_for_tenant.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_apartment_for_tenant.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.unitfix_units.name
    }
  }

  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_integration" "get_apartment_for_tenant_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_apartment_for_tenant.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_apartment_for_tenant_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "POST /get-tenant-apartment"
  target    = "integrations/${aws_apigatewayv2_integration.get_apartment_for_tenant_integration.id}"
}

resource "aws_lambda_permission" "allow_apigw_get_apartment_for_tenant" {
  statement_id  = "AllowAPIGatewayInvokeGetApartment"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_apartment_for_tenant.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
