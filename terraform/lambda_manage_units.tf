data "aws_caller_identity" "current" {}

resource "aws_lambda_function" "manage_units_function" {

  function_name = "manageUnitsFunction"
  runtime       = "python3.12"
  handler       = "manage_units.lambda_handler"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout       = 10

  filename         = "${path.module}/../backend/lambda/manage_units.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda/manage_units.zip")


  environment {
    variables = {
      UNITS_TABLE_NAME = aws_dynamodb_table.unitfix_units.name
    }
  }

  vpc_config {
    subnet_ids         = [aws_subnet.private_subnet_a.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}
