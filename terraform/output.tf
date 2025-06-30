output "user_pool_id" {
  value = aws_cognito_user_pool.unitfix_user_pool.id
}
output "user_pool_endpoint" {
  value = aws_cognito_user_pool.unitfix_user_pool.endpoint
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.unitfix_user_pool_client.id
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.unitfix_units.name
  description = "DynamoDB table name for storing unit records"
}

output "dynamodb_gateway_endpoint_id" {
  value       = aws_vpc_endpoint.dynamodb_endpoint.id
  description = "The Gateway VPC Endpoint ID for DynamoDB"
}

output "unitfix_api_url" {
  value = aws_apigatewayv2_api.unitfix_api.api_endpoint
  description = "Base URL of the UnitFix API"
}
