resource "aws_lambda_function" "get_scheduled_repairs" {
  function_name = "get_scheduled_repairs"
  filename      = "${path.module}/../backend/lambda/get_scheduled_repairs.zip"
  handler       = "get_scheduled_repairs.lambda_handler"
  runtime       = "python3.10"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_scheduled_repairs.zip")

  environment {
    variables = {
      REPAIRS_TABLE   = "UnitFix_ScheduledRepairs"
      COMPLAINTS_TABLE = "UnitFix_Complaints"
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_integration" "get_scheduled_repairs_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_scheduled_repairs.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_scheduled_repairs_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "GET /get-scheduled-repairs"
  target    = "integrations/${aws_apigatewayv2_integration.get_scheduled_repairs_integration.id}"
}

resource "aws_lambda_permission" "api_gateway_get_scheduled_repairs" {
  statement_id  = "AllowExecutionFromAPIGatewayGetScheduledRepairs"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_scheduled_repairs.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
