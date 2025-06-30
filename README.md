# 🏢 UnitFix — Cloud-Based Apartment Complaint Management System

UnitFix is a secure and scalable serverless web application that enables **tenants** to raise complaints and **owners** to manage units, view issues, and schedule repairs — all on AWS.

![final_arch_unitfix_b01012281 drawio](https://github.com/user-attachments/assets/54f784f7-6114-4aa6-a81d-88a9983a0695)

---

## 🌐 Live App Features

- 🔐 User sign-up & login with **Cognito**
- 🧾 File complaints with attachments (via **S3 pre-signed URLs**)
- 🔧 Schedule and track repairs
- 📊 View complaint history, filter by status
- 🧑‍💼 Owner dashboard for unit & tenant management
- ⚙️ Serverless backend + automated infrastructure using Terraform

---

## 🎬 Screenshots

### ✅ Welcome Page
A polished landing page with role-based login:
<img width="1512" alt="Screenshot 2025-06-30 at 7 12 25 PM" src="https://github.com/user-attachments/assets/78c596ae-a3f0-4d4d-a57f-67cd93a5a3e0" />

---

### 🧍 Tenant Dashboard
Raise new complaints, track previous ones, and view repair schedules:
<img width="1512" alt="Screenshot 2025-06-30 at 7 13 13 PM" src="https://github.com/user-attachments/assets/6cdb1107-80bf-498a-aa8f-3864e089fec1" />

---

### 🧑‍💼 Owner Dashboard
Manage units, tenants, view all complaints and schedule repairs:
![Uploading Screenshot 2025-06-30 at 7.18.47 PM.png…]()

---

## 📁 Project Structure

```

UnitFix/
├── backend/
│   └── lambda/                # Python Lambda handlers
├── terraform/                 # Infrastructure-as-Code (IaC)
├── unitfix-frontend/          # React frontend (Vite + Tailwind)
├── images/                    # Screenshots used in README
├── deploy\_unitfix.sh          # End-to-end deploy script
└── README.md

````

---

## 🚀 Quick Start

### 🧰 Prerequisites

- AWS CLI configured with Learner Lab / Free Tier
- Terraform `>= 1.3`
- Node.js `>= 18`
- Python 3.12+
- Bash terminal

### 🖥️ One-Line Deployment

```bash
./deploy_unitfix.sh
````

This automates:

1. Zipping all Lambda files in `backend/lambda`
2. Running `terraform apply` to provision infra
3. Running `npm run build` for frontend
4. Uploading frontend to S3 bucket

---

## 🔐 Security Highlights

* 🛡️ JWT route protection using **AWS Cognito**
* 🔏 Pre-signed S3 URLs for safe file uploads
* 🔒 IAM Role-based access (LabRole)
* 🌐 All sensitive resources inside a **VPC** with NAT + private subnets

---

## ⚙️ Cloud Services Used

| Category       | Services Used                                  |
| -------------- | ---------------------------------------------- |
| **Compute**    | AWS Lambda                                     |
| **Storage**    | S3, DynamoDB                                   |
| **Networking** | API Gateway, VPC, NAT Gateway, Security Groups |
| **Auth**       | Cognito                                        |
| **Monitoring** | CloudWatch                                     |
| **IaC**        | Terraform                                      |
| **Automation** | EventBridge + SNS                              |

---

## 📦 Cost Estimation (AWS Learner Lab)

| Service     | Cost Estimate          |
| ----------- | ---------------------- |
| Lambda      | Free (<1M reqs/month)  |
| S3          | Free (<1GB)            |
| DynamoDB    | Micro-cost (on-demand) |
| API Gateway | Negligible (<1K/day)   |
| Cognito     | Free Tier              |

💡 Total estimated cost: **\$0–\$1**

---

## 🔧 Infrastructure as Code

* Entire infra (Cognito, Lambdas, API Gateway, DynamoDB, VPC, etc.) is provisioned via **Terraform**
* Lambda zipping, packaging, deployment handled via `deploy_unitfix.sh`
* Frontend hosted on S3 with public access policy

---

## 🧠 Learning Outcomes

* ✅ Applied the **AWS Well-Architected Framework**
* ✅ Designed and deployed a **production-ready 3-tier cloud architecture**
* ✅ Followed **security best practices** (JWT, least privilege IAM, VPC isolation)
* ✅ Implemented **full CI/CD automation** with IaC and scripting

---

## 👤 Author

**Sakthi Sharan Mahadevan**
B01012281
Dalhousie University, Summer 2025
*Course: CSCI 5411 – Advanced Cloud Architecting*
---
