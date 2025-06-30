resource "aws_lambda_function" "get_complaints" {
  function_name = "get_complaints"
  filename      = "${path.module}/../backend/lambda/get_complaints.zip"
  handler       = "get_complaints.lambda_handler"
  runtime       = "python3.10"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_complaints.zip")

  environment {
    variables = {
      TABLE_NAME = "UnitFix_Complaints"
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_integration" "get_complaints_integration" {
  api_id                = aws_apigatewayv2_api.unitfix_api.id
  integration_type      = "AWS_PROXY"
  integration_uri       = aws_lambda_function.get_complaints.invoke_arn
  integration_method    = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_complaints_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "GET /get-complaints"
  target    = "integrations/${aws_apigatewayv2_integration.get_complaints_integration.id}"
}

resource "aws_lambda_permission" "api_gateway_get_complaints" {
  statement_id  = "AllowExecutionFromAPIGatewayGetComplaints"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_complaints.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
