URL Shortener 🚀
A scalable URL Shortener application built using Node.js, React.js, MongoDB, Redis, Nginx, and Docker.
This project demonstrates real-world System Design concepts such as:
Load Balancing
Distributed Caching
API Gateway
Rate Limiting
Microservice-ready Architecture
Docker-based Deployment

📌 Features
✅ URL Shortening
Convert long URLs into short URLs.
Example:
https://google.com
↓
http://localhost:8080/abc123

✅ Custom Short URLs
Users can create custom links.
Example:
http://localhost:8080/my-link

✅ URL Expiry
Links can expire after a configured duration.

✅ Redis Caching
Frequently accessed URLs are cached in Redis for faster redirection.

✅ Nginx Load Balancer
Traffic is distributed across multiple backend instances.
backend1 → backend2 → backend3

✅ Rate Limiting
Protects APIs from abuse using Redis-based rate limiting.

✅ React Frontend
Modern UI with Glassmorphism design.

✅ Dockerized Setup
Entire application runs using Docker Compose.

🏗️ System Architecture
               ┌─────────────┐
               │   Client    │
               └──────┬──────┘
                      │
                      ▼
         ┌────────────────────────┐
         │ Nginx (API Gateway +   │
         │    Load Balancer)      │
         └─────────┬──────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│Backend1 │   │Backend2 │   │Backend3 │
└────┬────┘   └────┬────┘   └────┬────┘
    │              │             │
    └──────────────┼─────────────┘
                   ▼
            ┌───────────┐
            │   Redis   │
            └─────┬─────┘
                  ▼
            ┌───────────┐
            │ MongoDB   │
            └───────────┘

🛠️ Tech Stack
Technology
Purpose
Node.js
Backend
Express.js
API Framework
React.js
Frontend
MongoDB
Database
Redis
Cache
Nginx
Load Balancer / API Gateway
Docker
Containerization


📂 Project Structure
url-shortener/
│
├── backend/
│   ├── app.js
│   ├── model.js
│   ├── redis.js
│   ├── db.js
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md

🚀 How to Run the Project
1️⃣ Clone Repository
git clone https://github.com/thanammalay/url-shortener.git
cd url-shortener

2️⃣ Start Docker Containers
docker-compose up --build

🌐 Application URLs
Service
URL
Frontend
http://localhost:8080
MongoDB
localhost:27017


🔥 API Endpoints
Create Short URL
POST /api/shorten
Request
{
 "url": "https://google.com",
 "customCode": "my-link",
 "expiryMinutes": 60
}

Get All URLs
GET /api/urls

Redirect URL
GET /:code

⚡ Redis Cache Flow
Request → Redis
       ↓
  Cache Hit → Redirect
       ↓
  Cache Miss → MongoDB → Redis → Redirect

🔒 Rate Limiting
Implemented using Redis.
Example:
5 requests per minute per IP

📈 Future Improvements
JWT Authentication
Analytics Dashboard
Click Tracking
Pagination
QR Code Generation
Kubernetes Deployment
Microservices Architecture

🎯 Key System Design Concepts Used
Load Balancing
API Gateway
Distributed Caching
Horizontal Scaling
Reverse Proxy
Rate Limiting
Docker Containerization

