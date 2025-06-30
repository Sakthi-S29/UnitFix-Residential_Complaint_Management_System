resource "aws_vpc_endpoint" "dynamodb_endpoint" {
  vpc_id            = aws_vpc.unitfix_vpc.id
  service_name      = "com.amazonaws.us-east-1.dynamodb"
  vpc_endpoint_type = "Gateway"
  route_table_ids = [
    aws_route_table.private_rt.id
  ]

  tags = {
    Name = "unitfix-dynamodb-endpoint"
  }
}
