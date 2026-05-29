# E-Commerce CI/CD Project
## Angular + Java Spring Boot + Docker + Qodana

---

## Project Structure

```
cicd-project/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                  ← Full CI/CD pipeline (9 jobs)
│
├── frontend/                          ← Angular 17 (standalone components)
│   ├── src/app/
│   │   ├── components/users/          ← CRUD user management UI
│   │   ├── components/products/       ← CRUD product catalog UI
│   │   ├── services/                  ← HTTP services
│   │   ├── models/                    ← TypeScript interfaces
│   │   └── app.routes.ts              ← Routing
│   ├── Dockerfile                     ← Multi-stage: Node build → Nginx
│   └── nginx.conf                     ← SPA routing + API proxy
│
├── services/
│   ├── user-service/                  ← Spring Boot 3 (port 8081)
│   │   ├── src/main/java/...
│   │   │   ├── controller/UserController.java
│   │   │   ├── service/UserService.java
│   │   │   ├── model/User.java
│   │   │   └── repository/UserRepository.java
│   │   ├── pom.xml                    ← Maven + JaCoCo
│   │   ├── qodana.yaml                ← Qodana config
│   │   └── Dockerfile                 ← Multi-stage: JDK build → JRE runtime
│   │
│   ├── product-service/               ← Spring Boot 3 (port 8082)
│   │   ├── src/main/java/...
│   │   ├── pom.xml
│   │   ├── qodana.yaml
│   │   └── Dockerfile
│   │
│   └── api-gateway/                   ← Spring Cloud Gateway (port 8080)
│       ├── src/main/java/...
│       ├── pom.xml
│       └── Dockerfile
│
├── docker-compose.yml                 ← Local full-stack dev
└── docker-compose.staging.yml         ← Staging/prod image overrides
```

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | Angular 17 (standalone)           |
| Backend        | Java 21 + Spring Boot 3           |
| API Gateway    | Spring Cloud Gateway + Resilience4j |
| Database       | H2 in-memory (swap for Postgres)  |
| Containerisation | Docker (multi-stage builds)     |
| Orchestration  | Docker Compose                    |
| CI/CD          | GitHub Actions                    |
| Code Quality   | Qodana (JetBrains)                |
| Security Scan  | Trivy (CVE scanning)              |
| Registry       | GitHub Container Registry (GHCR)  |

---

## Run Locally

### Prerequisites
- Docker Desktop
- Java 21
- Node.js 20
- Maven 3.9+
- Angular CLI 17 (`npm install -g @angular/cli`)

### Option A — Docker Compose (full stack)
```bash
git clone https://github.com/your-org/cicd-project.git
cd cicd-project
docker-compose up --build
```

| Service         | URL                            |
|-----------------|--------------------------------|
| Frontend        | http://localhost               |
| API Gateway     | http://localhost:8080          |
| User Service    | http://localhost:8081/api/users |
| Product Service | http://localhost:8082/api/products |

### Option B — Run services individually

```bash
# Terminal 1 — user-service
cd services/user-service
mvn spring-boot:run

# Terminal 2 — product-service
cd services/product-service
mvn spring-boot:run

# Terminal 3 — api-gateway
cd services/api-gateway
mvn spring-boot:run

# Terminal 4 — frontend
cd frontend
npm install
ng serve
```

---

## CI/CD Pipeline (9 Jobs)

```
Push to main
│
├── [parallel] test-user-service      → mvn verify + JaCoCo report
├── [parallel] test-product-service   → mvn verify + JaCoCo report
├── [parallel] test-frontend          → ng lint + ng test + ng build
│
├── [after tests] qodana-user-service    → static analysis + quality gate
├── [after tests] qodana-product-service → static analysis + quality gate
│
├── [after qodana] docker-build-push     → build 4 images, push to GHCR
│
├── [after docker] trivy-scan            → CVE scan all images
│
├── [after trivy] deploy-staging         → SSH deploy + smoke tests
│
└── [manual approval] deploy-production  → rolling update + health check
```

---

## GitHub Secrets Required

Go to **Settings → Secrets and variables → Actions** and add:

| Secret                    | Purpose                              |
|---------------------------|--------------------------------------|
| `QODANA_TOKEN_USER`       | Qodana Cloud token for user-service  |
| `QODANA_TOKEN_PRODUCT`    | Qodana Cloud token for product-service |
| `STAGING_HOST`            | Staging server IP                    |
| `STAGING_USER`            | SSH username                         |
| `STAGING_SSH_KEY`         | SSH private key                      |
| `PROD_HOST`               | Production server IP                 |
| `PROD_USER`               | SSH username                         |
| `PROD_SSH_KEY`            | SSH private key                      |

> `GITHUB_TOKEN` is automatically provided — no setup needed.

---

## Qodana Setup

1. Go to [qodana.cloud](https://qodana.cloud) and sign in with JetBrains account
2. Create a project for each service
3. Copy the token into `QODANA_TOKEN_USER` / `QODANA_TOKEN_PRODUCT` secrets
4. Qodana runs after tests and blocks Docker build if quality gate fails
5. Reports are available in GitHub Actions artifacts and Qodana Cloud dashboard

To run Qodana locally:
```bash
cd services/user-service
# Install Qodana CLI: https://github.com/JetBrains/qodana-cli
qodana scan --show-report
```

---

## Production Approval Gate

The `deploy-production` job uses a GitHub Environment named `production`.

To require manual approval before production deploy:
1. Go to **Settings → Environments → production**
2. Enable **Required reviewers**
3. Add yourself or your team lead

The pipeline will pause after staging and wait for approval.

---

## API Reference

### User Service (`/api/users`)

| Method | Path         | Description         |
|--------|--------------|---------------------|
| GET    | /health      | Health check        |
| GET    | /            | List all users      |
| GET    | /{id}        | Get user by ID      |
| POST   | /            | Create user         |
| PUT    | /{id}        | Update user         |
| DELETE | /{id}        | Delete user         |

### Product Service (`/api/products`)

| Method | Path             | Description                     |
|--------|------------------|---------------------------------|
| GET    | /health          | Health check                    |
| GET    | /                | List all (optional ?category=X) |
| GET    | /?search=keyword | Search products by name         |
| GET    | /{id}            | Get product by ID               |
| POST   | /                | Create product                  |
| PUT    | /{id}            | Update product                  |
| DELETE | /{id}            | Delete product                  |