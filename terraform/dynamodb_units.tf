resource "aws_dynamodb_table" "unitfix_units" {
  name           = "UnitFix_Units"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "apartment_id"   # Partition key
  range_key      = "unit_id"        # Sort key

  attribute {
    name = "apartment_id"
    type = "S"
  }

  attribute {
    name = "unit_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name        = "UnitFix_Units"
    Environment = "dev"
    Project     = "UnitFix"
  }
}
