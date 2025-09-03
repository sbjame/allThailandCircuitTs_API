[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

# Thailand Circuit Gps Api

[Demo](https://thailandcircuitgpsapi.onrender.com)

## Table of Contents
- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [API Endpoints](#apiendpoint)
  - [Circuits](#circuits)
  - [Users](#users)
  - [Weather](#weather)
- [Project Structure](#project-structure)

## About
This project is a Node.js + TypeScript RESTful API for managing information about racing circuits in Thailand along with weather data integration.
It provides endpoints for circuits, users, and weather services, supporting authentication, file uploads, and scheduled background jobs.

## Features
- Circuit management (CRUD for Thailand racing circuits)
- User authentication & authorization (JWT)
- Weather integration with external API
- Cron jobs for updating weather data automatically
- File upload support (Cloudinary + Multer)
- Centralized error handling middleware
- MongoDB connection with Mongoose

## Technologies
- Runtime: Node.js
- Language: TypeScript
- Framework: Express.js
- Database: MongoDB
- Auth: JWT
- File Uploads: Multer + Cloudinary
- Scheduler: Node Cron
- Other: dotenv, bcrypt, etc.

## Getting Started

### Prerequisites
- Node.js (v24 or newer)
- npm or yarn

### Installation
```bash
git clone [https://github.com/sbjame/ThailandCircuitGpsApi.git](https://github.com/sbjame/ThailandCircuitGpsApi.git)
cd ThailandCircuitGpsApi
npm install
```
### Environment Variables
```bash
#### Server
PORT=5000

#### Database
MONGODB_URI=your_mongodb_uri [From](https://www.mongodb.com)

#### Authentication
TOKEN_KEY=your_token_key

#### Cloudinary (for image/file uploads) [From](https://cloudinary.com/home)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

#### Weather API (e.g., OpenWeatherMap)
WEATHER_API_KEY=your_weather_api_key [From](https://www.weatherapi.com)
```

### Running Locally
```bash
#Development
npm run dev
Then open http://localhost:5000 in your browser.

#Build & Production
npm run build
npm start
```

## API Endpoints
### Circuits
- GET /api/circuits → Get all circuits
- GET /api/circuits/:id → Get a single circuit
- POST /api/circuits → Create a circuit
- PATCH /api/circuits/:id → Update a circuit
- DELETE /api/circuits/:id → Soft delete a circuit
  
### Users
- POST /api/users/register → Register new user
- POST /api/users/login → Login and receive token

### Weather
- GET /api/weather → Manual update weather for a circuit
- (cron job automatically updates weather in DB)

## Project Struture
src/
├── app.ts              # Main app setup
├── server.ts           # Server entry point
├── config/             # Configurations (env, MongoDB)
├── controllers/        # Business logic (circuit, user, weather)
├── cron/               # Scheduled jobs (weather updates)
├── middlewares/        # Auth, error handler, file upload
├── models/             # Mongoose schemas
├── routes/             # Express routes
├── services/           # Weather service
└── utils/              # Cloudinary helper
