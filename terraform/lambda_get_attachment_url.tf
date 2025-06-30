resource "aws_lambda_function" "get_attachment_url" {
  filename         = "${path.module}/../backend/lambda/get_attachment_url.zip"
  function_name    = "get_attachment_url"
  handler          = "get_attachment_url.lambda_handler"
  runtime          = "python3.10"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/get_attachment_url.zip")

  environment {
    variables = {
      COMPLAINTS_TABLE  = aws_dynamodb_table.unitfix_complaints.name
      ATTACHMENT_BUCKET = aws_s3_bucket.attachments_bucket.bucket
    }
  }
  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}

resource "aws_apigatewayv2_integration" "get_attachment_url_integration" {
  api_id                 = aws_apigatewayv2_api.unitfix_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_attachment_url.invoke_arn
  integration_method     = "POST" # ✅ must be POST for AWS_PROXY
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_attachment_url_route" {
  api_id    = aws_apigatewayv2_api.unitfix_api.id
  route_key = "POST /get-attachment-url"  # ✅ route still POST
  target    = "integrations/${aws_apigatewayv2_integration.get_attachment_url_integration.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_get_attachment" {
  statement_id  = "AllowExecutionFromAPIGatewayGetAttachment"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_attachment_url.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.unitfix_api.execution_arn}/*/*"
}
