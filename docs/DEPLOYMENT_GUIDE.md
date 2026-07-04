# ShopEase — Complete Step-by-Step Run Guide

> **Who is this for?** Shreya Jade setting up ShopEase for the first time on a Windows laptop with IntelliJ.  
> No Docker required to run locally. Follow every step in order.

---

## PART 1 — Prerequisites (one-time setup)

### 1.1 Check Java version
Open **Command Prompt** and run:

    java -version

You should see **Java 17**. If not, download from https://adoptium.net/

### 1.2 Check Maven

    mvn -version

If not installed, download from https://maven.apache.org/download.cgi  
Add Maven `bin` folder to your Windows PATH environment variable.

---

## PART 2 — Install PostgreSQL (one-time)

1. Download PostgreSQL 15 from https://www.postgresql.org/download/windows/
2. Run installer. During setup:
   - Password: `postgres`  (must match application.properties)
   - Port: `5432` (default, do not change)
3. After install, open **pgAdmin** (auto-installed)
4. Login: user = `postgres`, password = what you set
5. Right-click **Databases → Create → Database**
6. Name it: `shopease_db`
7. Click **Save**

---

## PART 3 — Install Redis (one-time)

Redis does not have an official Windows release. Use WSL2:

### Option A — WSL2 (recommended if you have it)
Open Ubuntu terminal in WSL2:

    sudo apt update
    sudo apt install redis-server
    sudo service redis-server start
    redis-cli ping
    # Should print: PONG

### Option B — Windows community build
1. Go to https://github.com/tporadowski/redis/releases
2. Download `Redis-x64-x.x.x.zip`
3. Extract to `C:\Redis`
4. Open cmd, go to `C:\Redis`, run: `redis-server.exe`
5. Keep this window open while running the project

---

## PART 4 — Get Razorpay Test Keys (one-time, 5 minutes)

1. Go to https://razorpay.com → Sign Up (free)
2. After signup: Settings → API Keys → Generate Test Mode API Keys
3. Copy:
   - Key ID (starts with `rzp_test_`)
   - Key Secret
4. Open: `backend/src/main/resources/application.properties`
5. Replace these two lines:
   - `app.razorpay.key.id=YOUR_RAZORPAY_KEY_ID`
   - `app.razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET`
   with your actual keys

---

## PART 5 — Download the Project

Extract the ZIP to any folder, e.g. `C:\Projects\shopease`

OR clone from GitHub:

    git clone https://github.com/YOUR_USERNAME/shopease.git
    cd shopease

---

## PART 6 — Run the Backend (Spring Boot)

### Using IntelliJ IDEA (recommended):
1. File → Open → Select the `shopease/backend` folder
2. IntelliJ detects `pom.xml` and imports Maven — wait for download
3. Find `ShopEaseApplication.java` in `src/main/java/com/shopease/`
4. Right-click → Run `ShopEaseApplication`
5. Wait for: `Started ShopEaseApplication in X.XXX seconds`

### Using Command Line:
    cd shopease/backend
    mvn clean install -DskipTests
    mvn spring-boot:run

### Verify backend is running:
Open http://localhost:8080/swagger-ui.html
You should see the Swagger API documentation page.

---

## PART 7 — Seed the Database

After the backend starts for the **first time**, Hibernate creates all tables.
Then load sample data:

1. Open pgAdmin
2. Connect to `shopease_db` → Tools → Query Tool
3. Open `shopease/backend/src/main/resources/data.sql`
4. Copy all contents → Paste into Query Tool → Execute (F5)

This creates:
- Admin user: `admin@shopease.com` / `admin123`
- 5 product categories
- 6 sample products with images

---

## PART 8 — Run the Frontend (React)

Open a NEW terminal window (keep Spring Boot running):

    cd shopease/frontend
    npm install
    npm run dev

You should see:

    VITE ready in XXX ms
    Local: http://localhost:3000/

Open http://localhost:3000 in your browser.

---

## PART 9 — Test the Application

### Customer flow:
1. Click Sign Up → create account
2. Browse products → Add to Cart
3. Cart → Proceed to Checkout
4. Enter any shipping address
5. Click Pay Now → Razorpay popup opens
6. Test card: `4111 1111 1111 1111`, Expiry: `12/26`, CVV: `123`
7. Click Pay → order placed!
8. View order in My Orders

### Admin flow:
1. Login: `admin@shopease.com` / `admin123`
2. Redirected to /admin dashboard
3. Products → Create/Edit/Delete products
4. Categories → Add categories
5. Orders → Update status (PAID → SHIPPED → DELIVERED)

---

## PART 10 — Swagger API Explorer

While backend is running: http://localhost:8080/swagger-ui.html

To test protected endpoints:
1. Click Authorize (lock icon)
2. Call POST /api/auth/login with admin credentials
3. Copy the `token` from response
4. Authorize → paste: `Bearer YOUR_TOKEN_HERE`

---

## Troubleshooting

### "Connection refused" on startup
PostgreSQL is not running. Check pgAdmin → server must be running.

### "Cannot connect to Redis"
Redis not started. Run redis-server.exe or start WSL Redis service.

### Port 8080 already in use
Open cmd:

    netstat -ano | findstr :8080
    taskkill /PID <the_pid_number> /F

### Maven dependencies not downloading
    mvn clean install -U

### npm install fails
Delete `node_modules` folder, then `npm install` again.

---

## Port Reference

- Spring Boot backend: http://localhost:8080
- React frontend:      http://localhost:3000
- PostgreSQL:          localhost:5432
- Redis:               localhost:6379

---

## What to say in the interview

"I built ShopEase — a production-grade e-commerce platform with Spring Boot and React. 
The backend implements JWT-based stateless authentication with Spring Security, uses JPA 
with PostgreSQL, Redis for cart management, and Razorpay payment gateway with HMAC-SHA256 
signature verification. I wrote JUnit 5 unit tests with Mockito, documented APIs with 
Swagger/OpenAPI, containerised with Docker and docker-compose, and set up CI/CD with 
GitHub Actions."

---

ShopEase v1.0 — Spring Boot 3.2 + React 18 + PostgreSQL + Redis + Razorpay
