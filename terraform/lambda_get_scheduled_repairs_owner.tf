resource "aws_lambda_function" "get_scheduled_repairs_owner" {
  function_name = "get_scheduled_repairs_owner"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  handler       = "get_scheduled_repairs_owner.lambda_handler"
  runtime       = "python3.12"
  timeout       = 10

  filename         = "${path.module}/../backend/lambda/get_scheduled_repairs_owner.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_scheduled_repairs_owner.zip")

  environment {
    variables = {
      REPAIRS_TABLE     = "UnitFix_ScheduledRepairs"
      COMPLAINTS_TABLE  = "UnitFix_Complaints"
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_route" "get_scheduled_repairs_owner" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "GET /get-scheduled-repairs-owner"
  target    = "integrations/${aws_apigatewayv2_integration.get_scheduled_repairs_owner.id}"
}

resource "aws_apigatewayv2_integration" "get_scheduled_repairs_owner" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_scheduled_repairs_owner.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_lambda_permission" "apigw_get_scheduled_repairs_owner" {
  statement_id  = "AllowAPIGatewayInvokeGetScheduledRepairsOwner"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_scheduled_repairs_owner.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
