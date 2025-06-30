resource "aws_lambda_function" "get_apartments" {
  function_name = "get_apartments"
  handler       = "get_apartments.lambda_handler"
  runtime       = "python3.12"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout       = 10

  filename         = "${path.module}/../backend/lambda/get_apartments.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_apartments.zip")

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

resource "aws_apigatewayv2_integration" "get_apartments_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_apartments.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_apartments_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "GET /get-apartments"
  target    = "integrations/${aws_apigatewayv2_integration.get_apartments_integration.id}"
}

resource "aws_lambda_permission" "allow_apigw_get_apartments" {
  statement_id  = "AllowAPIGatewayInvokeGetApartments"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_apartments.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
