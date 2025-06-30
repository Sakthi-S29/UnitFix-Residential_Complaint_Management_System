resource "aws_lambda_function" "auto_resolve_repairs" {
  function_name = "auto_resolve_repairs"
  handler       = "auto_resolve_repairs.lambda_handler"
  runtime       = "python3.12"
  filename      = "${path.module}/../backend/lambda/auto_resolve_repairs.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/auto_resolve_repairs.zip")

  environment {
    variables = {
      REPAIRS_TABLE    = "UnitFix_ScheduledRepairs"
      COMPLAINTS_TABLE = "UnitFix_Complaints"
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

resource "aws_cloudwatch_event_rule" "auto_resolve_rule" {
  name                = "auto-resolve-repairs-hourly"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "auto_resolve_target" {
  rule      = aws_cloudwatch_event_rule.auto_resolve_rule.name
  target_id = "AutoResolveLambda"
  arn       = aws_lambda_function.auto_resolve_repairs.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_invoke_auto_resolve" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auto_resolve_repairs.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.auto_resolve_rule.arn
}
