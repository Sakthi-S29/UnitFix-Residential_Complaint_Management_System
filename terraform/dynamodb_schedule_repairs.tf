resource "aws_dynamodb_table" "scheduled_repairs" {
  name           = "UnitFix_ScheduledRepairs"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "repair_id"
  range_key      = "complaint_id"

  attribute {
    name = "repair_id"
    type = "S"
  }

  attribute {
    name = "complaint_id"
    type = "S"
  }
}
