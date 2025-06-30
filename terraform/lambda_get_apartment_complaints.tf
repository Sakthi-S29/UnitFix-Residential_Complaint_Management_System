resource "aws_lambda_function" "get_apartment_complaints_lambda" {
  function_name = "get_apartment_complaints"
  filename      = "${path.module}/../backend/lambda/get_apartment_complaints.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_apartment_complaints.zip")
  handler       = "get_apartment_complaints.lambda_handler"
  runtime       = "python3.12"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  environment {
    variables = {
      COMPLAINTS_TABLE_NAME = aws_dynamodb_table.unitfix_complaints.name
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_integration" "get_apartment_complaints_integration" {
  api_id             = aws_apigatewayv2_api.unitfix_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_apartment_complaints_lambda.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_apartment_complaints_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "GET /apartment-complaints"
  target    = "integrations/${aws_apigatewayv2_integration.get_apartment_complaints_integration.id}"
}

resource "aws_lambda_permission" "allow_apigw_invoke_get_apartment_complaints" {
  statement_id  = "AllowAPIGatewayInvokeGetApartmentComplaints"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_apartment_complaints_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
