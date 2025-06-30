# 🛠️ UnitFix — Cloud-Based Apartment Complaint Management System

UnitFix is a modern, serverless web application that allows tenants to raise complaints and apartment owners to manage and schedule repairs. Built entirely on AWS using best practices in infrastructure, security, and scalability.

![Architecture](images/architecture-diagram.png)

---

## 🌟 Features

- 🔐 **Authentication** with AWS Cognito
- 📤 **Complaint Filing** with file attachment via pre-signed URLs
- 🛠️ **Repair Scheduling** and status tracking
- 📦 **Serverless Backend** with AWS Lambda + API Gateway
- 🗃️ **Data Storage** using DynamoDB (complaints, tenants, repairs)
- 🌐 **React Frontend** hosted on Amazon S3
- 📊 **Monitoring** via CloudWatch
- ⚙️ **Fully automated deployment** using Terraform + Bash script

---

## 📁 Project Structure

```

UnitFix/
├── backend/
│   └── lambda/                  # Python Lambda handlers
├── terraform/                   # Infrastructure as Code
├── unitfix-frontend/            # React frontend
├── images/                      # Architecture & logs screenshots
├── deploy\_unitfix.sh           # Deployment script
└── README.md

````

---

## 🚀 Quick Setup

### 📦 Prerequisites

- AWS CLI (configured)
- Terraform `>= 1.3`
- Node.js + npm `>= 18`
- Python 3.12+
- AWS Learner Lab account or AWS Free Tier account

### 🔧 One-Command Deployment

```bash
./deploy_unitfix.sh
````

This script:

1. Zips all Lambda handlers in `backend/lambda/`
2. Deploys infrastructure using Terraform in `terraform/`
3. Builds frontend (`npm run build`) and uploads to S3

---

## 🔐 Security

* JWT-based route protection via **Cognito**
* Pre-signed URLs for **secure file uploads**
* IAM-scoped permissions via **LabRole**
* Lambdas and DB run inside a **VPC** with private subnets and **NAT Gateway**

---

## 📊 Monitoring & IaC

* All logs piped to **CloudWatch**
* Alerting on Lambda errors and S3 triggers
* **Terraform-managed** infrastructure:

  * Lambdas, API Gateway, S3, DynamoDB, Cognito, VPC, EventBridge
* Visual output after `terraform apply`:

![Terraform Output](images/terraform-output.png)

---

## 💰 Cost Summary (AWS Learner Lab)

| Service     | Cost                       |
| ----------- | -------------------------- |
| Lambda      | Free (<1M requests)        |
| API Gateway | Negligible (<1K calls/day) |
| DynamoDB    | On-demand (micro-cost)     |
| S3          | Free (<1GB storage)        |
| Cognito     | Free tier eligible         |

> 💡 Estimated cost: **\$0** under AWS Learner Lab or Free Tier.

---

## 📈 Future Enhancements

* Staff dashboard with complaint filters
* CI/CD via GitHub Actions
* Notifications via SNS
* Complaint status visualization
* CloudFront + WAF

---

## 🧑‍💻 Author

**Sakthi Sharan Mahadevan**
B01012281
Dalhousie University — Summer 2025
CSCI 5411 – Advanced Cloud Architecting

---

## 📚 References

* [AWS Serverless Best Practices](https://docs.aws.amazon.com/serverless/latest/application/serverless-best-practices.html)
* [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
* [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
* [Pre-signed URLs with S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)

---

> ✨ This project is designed for cloud-native production readiness — fully automated, secure, scalable, and optimized.
