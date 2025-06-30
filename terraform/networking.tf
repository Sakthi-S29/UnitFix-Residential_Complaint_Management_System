# VPC
resource "aws_vpc" "unitfix_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "unitfix-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "unitfix_igw" {
  vpc_id = aws_vpc.unitfix_vpc.id
  tags = {
    Name = "unitfix-igw"
  }
}

# Public Subnet (for NAT)
resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.unitfix_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "unitfix-public-subnet-a"
  }
}

# NAT Gateway
resource "aws_eip" "nat_eip" {
  tags = {
    Name = "unitfix-nat-eip"
  }
}


resource "aws_nat_gateway" "unitfix_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet_a.id
  tags = {
    Name = "unitfix-nat"
  }
}

# Private Subnet A (Lambdas)
resource "aws_subnet" "private_subnet_a" {
  vpc_id            = aws_vpc.unitfix_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "unitfix-private-subnet-a"
  }
}

# Private Subnet B (DynamoDB)
resource "aws_subnet" "private_subnet_b" {
  vpc_id            = aws_vpc.unitfix_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "unitfix-private-subnet-b"
  }
}

# Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.unitfix_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.unitfix_igw.id
  }
  tags = {
    Name = "unitfix-public-rt"
  }
}

# Public Subnet Association
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_rt.id
}

# Private Route Table (for NAT)
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.unitfix_vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.unitfix_nat.id
  }
  tags = {
    Name = "unitfix-private-rt"
  }
}

# Associate Private Subnets
resource "aws_route_table_association" "private_a_assoc" {
  subnet_id      = aws_subnet.private_subnet_a.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_b_assoc" {
  subnet_id      = aws_subnet.private_subnet_b.id
  route_table_id = aws_route_table.private_rt.id
}

# Security Group for Lambdas
resource "aws_security_group" "lambda_sg" {
  name        = "unitfix-lambda-sg"
  description = "Allow API Gateway to invoke Lambda"
  vpc_id      = aws_vpc.unitfix_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # OR restrict to API Gateway CIDR blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "lambda-security-group"
  }
}

# Private Subnet A for DynamoDB (Primary)
resource "aws_subnet" "private_db_subnet_a" {
  vpc_id            = aws_vpc.unitfix_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "unitfix-private-db-subnet-a"
  }
}

# Associate with the private route table
resource "aws_route_table_association" "private_db_assoc_a" {
  subnet_id      = aws_subnet.private_db_subnet_a.id
  route_table_id = aws_route_table.private_rt.id
}
