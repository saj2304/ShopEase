# ShopEase — Full-Stack E-Commerce Platform

A production-ready e-commerce application built with Spring Boot 3.2 and React 18.

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.2
- Spring Security + JWT (stateless auth)
- Spring Data JPA + Hibernate + PostgreSQL
- Redis (shopping cart)
- Razorpay payment gateway
- Swagger/OpenAPI 3.0 documentation
- JUnit 5 + Mockito (unit tests)
- Docker + Docker Compose

**Frontend**
- React 18, Vite
- React Router v6
- Axios (API calls)
- Tailwind CSS (utility-first styling)
- Context API (state management)
- Lucide React (icons)

## Features

- Customer registration and JWT login
- Product catalog with search and category filter
- Paginated product listing
- Redis-backed shopping cart
- Razorpay payment integration (test mode)
- Order placement and tracking
- Admin dashboard with stats
- Admin CRUD for products, categories
- Admin order management with status updates
- Soft delete for products
- Global exception handling with proper HTTP status codes
- CORS configuration
- Swagger UI at /swagger-ui.html

## Getting Started

See **docs/DEPLOYMENT_GUIDE.md** for complete step-by-step instructions.

Quick start:

    # Backend
    cd backend && mvn spring-boot:run

    # Frontend (new terminal)
    cd frontend && npm install && npm run dev

Open http://localhost:3000

**Admin login**: admin@shopease.com / admin123

## API Documentation

http://localhost:8080/swagger-ui.html (while backend is running)
