# Monnify Payroll System API

A production-style payroll processing system built with Node.js, Express, TypeScript, PostgreSQL, Redis, and Docker.

This project demonstrates how to build scalable payroll infrastructure using background jobs, bulk payment processing, webhook handling, RBAC authentication, and asynchronous transaction reconciliation with Monnify.

## Features

* Employee management system
* Payroll batch creation and processing
* Monnify bulk disbursement integration
* Background job processing using Bull + Redis
* PostgreSQL database persistence
* Webhook-based payment updates
* Transaction reconciliation
* JWT authentication and RBAC
* Swagger API documentation
* Dockerized local development setup
* Queue-based scalable architecture

---

# Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database & Queues

* PostgreSQL
* Redis
* Bull Queue

## DevOps & Tools

* Docker
* Docker Compose
* Swagger
* JWT Authentication

## Payment Integration

* Monnify API

---

# System Architecture

The payroll flow works like this:

1. Admin creates employees
2. Admin creates a payroll batch
3. Payroll items are added to queue
4. Bull workers process payments asynchronously
5. Monnify initiates bulk transfers
6. Webhooks update transaction status
7. Reconciliation updates payroll statistics

This architecture prevents API blocking and supports scalable payroll processing.

---

# Project Structure

```bash
src/
├── config/
├── controllers/
├── jobs/
├── middleware/
├── migrations/
├── models/
├── queues/
├── routes/
├── services/
├── utils/
├── validators/
└── index.ts
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/shem4soul/Monnify-Payroll-System.git
cd Monnify-Payroll-System
```

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```env
# Server
PORT=3008
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=payroll_db
DB_USER=payroll_user
DB_PASSWORD=payroll_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Monnify
MONNIFY_API_KEY=your_api_key
MONNIFY_SECRET_KEY=your_secret_key
MONNIFY_BASE_URL=https://sandbox.monnify.com
MONNIFY_CONTRACT_CODE=your_contract_code
MONNIFY_WEBHOOK_SECRET=your_webhook_secret

# JWT
JWT_SECRET=your_secret
```

---

# Docker Setup

## Start PostgreSQL and Redis

```bash
docker-compose up -d
```

## Verify services

```bash
docker-compose ps
```

---

# Database Migration

Run migrations:

```bash
npm run migrate
```

---

# Start Development Server

```bash
npm run dev
```

---

# API Documentation

Swagger documentation:

```bash
http://localhost:3008/api-docs
```

---

# Core Modules

## Employee Module

Handles:

* Employee onboarding
* Bank account management
* Employee identification
* Soft deletion
* Payroll eligibility

### Employee Fields

```ts
{
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  bankName: string;
  accountNumber: string;
  salary: number;
}
```

---

## Payroll Module

Handles:

* Payroll creation
* Batch processing
* Payroll statistics
* Reconciliation
* Payment tracking

### Payroll Status Lifecycle

```bash
pending → processing → completed
                     ↘ failed
```

---

## Queue Processing

Payroll processing uses Bull queues with Redis.

### Why Background Jobs?

Without queues:

* API requests timeout
* Server blocks during bulk processing
* Poor scalability

With Bull queues:

* Async processing
* Retry support
* Better reliability
* Scalable workers

### Queue Flow

```bash
Payroll Created
      ↓
Queue Job Added
      ↓
Worker Processes Payments
      ↓
Monnify Bulk Transfer
      ↓
Webhook Updates Status
```

---

# Monnify Integration

This system integrates with Monnify for:

* Bulk disbursement
* Transaction verification
* Account balance checks
* OTP authorization
* Webhook notifications

## Features Implemented

* Authentication token generation
* Automatic token refresh
* Bulk transfer initiation
* Transaction status lookup
* Webhook verification

---

# Security Features

* JWT authentication
* Role-based access control (RBAC)
* Secure webhook signature validation
* Input validation
* Error handling middleware
* Secure API architecture

---

# Sample API Endpoints

## Employees

```http
POST /api/employees
GET /api/employees
GET /api/employees/:id
PATCH /api/employees/:id
DELETE /api/employees/:id
```

## Payroll

```http
POST /api/payrolls
GET /api/payrolls
GET /api/payrolls/:id
POST /api/payrolls/:id/process
POST /api/payrolls/reconcile
```

---

# Example Payroll Processing Flow

## 1. Create Employee

```http
POST /api/employees
```

## 2. Create Payroll Batch

```http
POST /api/payrolls
```

## 3. Process Payroll

```http
POST /api/payrolls/:id/process
```

## 4. Queue Handles Background Processing

Bull worker processes transfers asynchronously.

## 5. Webhook Updates Payment Status

Monnify sends status updates automatically.

---

# Production Concepts Demonstrated

This project demonstrates real-world backend engineering concepts including:

* Queue-based architectures
* Payment gateway integration
* Event-driven systems
* Async job processing
* Financial transaction reconciliation
* Scalable API design
* Background workers
* Cloud-ready architecture
* Dockerized services

---

# Future Improvements

* Multi-currency payroll support
* Scheduled payroll automation
* Audit logs
* Admin dashboard
* Email notifications
* Microservice extraction
* Kubernetes deployment
* Retry dead-letter queues

---

# Testing

Run tests:

```bash
npm test
```

---

# Author

## Emmanuel Shittu

Backend Engineer focused on scalable fintech and payment infrastructure.

* GitHub: https://github.com/shem4soul
* LinkedIn: https://linkedin.com/in/emmanuel-shittu-91573915a

---

# License

MIT License
