resource "aws_cognito_user_pool" "unitfix_user_pool" {
  name = "unitfix-user-pool"

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
  lifecycle {
    ignore_changes = [
      schema,                     # 👈 prevents tf from modifying schema
      admin_create_user_config,   # optional
      deletion_protection         # optional
    ]
  }

  schema {
    name     = "role"
    attribute_data_type = "String"
    mutable  = true
    required = false
    developer_only_attribute = false
  }

  schema {
    name     = "location"
    attribute_data_type = "String"
    mutable  = true
    required = false
    developer_only_attribute = false
  }

  schema {
    name     = "apartment"
    attribute_data_type = "String"
    mutable  = true
    required = false
    developer_only_attribute = false
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = false
    require_numbers   = true
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  deletion_protection = "INACTIVE"
}

resource "aws_cognito_user_pool_client" "unitfix_user_pool_client" {
  name         = "unitfix-app-client"
  user_pool_id = aws_cognito_user_pool.unitfix_user_pool.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  access_token_validity = 60
  id_token_validity     = 60
  refresh_token_validity = 30
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  prevent_user_existence_errors = "ENABLED"
}
