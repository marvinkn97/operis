# OPERIS

**Operis** is a streamlined workspace designed to simplify project management through architectural precision and real-time progress tracking.

---

## ⚡ Core Features (Free)

- **Project Ledger:** Create, update, and manage project lifecycles.
- **Team Sync:** Seamlessly invite and manage workspace members via project invitations.
- **Objective Tracking:** Break projects into tasks with priority and deadline management.
- **System Health:** Real-time progress monitoring via the high-visibility Emerald dashboard.

---

## ✨ Premium Features ($5/mo)

- **Operis AI Assistant:** Integrated neural engine for task summarization and workflow insights.
- **Data Export:** Advanced CSV reporting and data auditing.
- **Priority Access:** Early enrollment in new system modules.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Angular (Signals & Standalone Components)
- **Styling:** Tailwind CSS (Systems Aesthetic)

### Backend
- **Framework:** Spring Boot (Java)
- **Security:** Keycloak (OIDC/OAuth2 Authentication & Authorization)
- **Messaging:** RabbitMQ (Pub/Sub for asynchronous events and notifications)
- **Payments:** Secure Stripe Integration

---

# 🚀 Getting Started

Follow the steps below to run **Operis locally**.

## 1️⃣ Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose

Verify installation:

```bash
docker --version
docker compose version
```

---

## 2️⃣ Launch the System

From the root project directory run:

```bash
docker compose up -d
```

This will start all required services including:

- Angular Frontend
- Spring Boot Backend Services
- Keycloak Authentication Server
- RabbitMQ Messaging Broker
- Supporting infrastructure

---

## 3️⃣ Access the Application

Once the containers are running, open your browser and navigate to:

```
http://localhost:4200
```

This will load the **Operis Angular UI**.

---

## 4️⃣ Stopping the System

To stop all running services:

```bash
docker compose down
```

---

## 📌 Notes

- The first startup may take a few minutes as Docker downloads and builds the images.
- Ensure ports such as **4200**, **8080**, and **5672** are not already in use.

---

**Operis: Professional workload management, simplified.**