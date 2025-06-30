resource "aws_lambda_function" "schedule_repair" {
  function_name = "schedule_repair_handler"
  runtime       = "python3.11"
  handler       = "schedule_repair_handler.lambda_handler"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  filename         = "${path.module}/../backend/lambda/schedule_repair_handler.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/schedule_repair_handler.zip")

  environment {
    variables = {
      COMPLAINTS_TABLE = "UnitFix_Complaints"
      REPAIRS_TABLE    = "UnitFix_ScheduledRepairs"
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  timeout = 10
}

resource "aws_lambda_permission" "api_gw_invoke_schedule_repair" {
  statement_id  = "AllowAPIGatewayInvokeScheduleRepair"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.schedule_repair.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "schedule_repair_integration" {
  api_id                  = aws_apigatewayv2_api.unitfix_api.id
  integration_type        = "AWS_PROXY"
  integration_uri         = aws_lambda_function.schedule_repair.invoke_arn
  integration_method      = "POST"
  payload_format_version  = "2.0"
}

resource "aws_apigatewayv2_route" "schedule_repair_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "POST /schedule-repair"
  target    = "integrations/${aws_apigatewayv2_integration.schedule_repair_integration.id}"
}
