# 3w-social-post-app

A complete full-stack social post application with React (Vite), Material UI, Node.js, Express, and MongoDB.

## Features
- JWT Authentication
- Clean, responsive mobile-first UI with Material UI
- Posts feed with pagination
- Cloudinary image uploads
- Like toggling
- Comments system

## Folder Structure
- `frontend/`: React Vite application
- `backend/`: Node.js Express server

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB URI (local or Atlas)
- Cloudinary credentials

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in credentials:
   - `PORT=5050`
   - `MONGO_URI=mongodb+srv://...`
   - `JWT_SECRET=your_jwt_secret`
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
4. Run `npm run dev` to start the backend on port 5050.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` in the `frontend` folder (if deploying backend remotely) with `VITE_API_URL=http://localhost:5050/api`. By default, it hits `localhost:5050`.
4. Run `npm run dev` to start the frontend.

## Deployment

### Vercel (Frontend)
The frontend folder contains a `vercel.json` to handle React Router client-side routing. Simply import the `frontend` directory in Vercel. Set `VITE_API_URL` environment variable to your production backend URL.

### Render (Backend)
Deploy the `backend` folder as a Web Service on Render. Set the root directory to `backend`, build command to `npm install`, and start command to `node server.js`. Add the environment variables from your `.env` file to the Render environment variables settings.

## API Documentation
- `POST /api/auth/signup`: Register user
- `POST /api/auth/login`: Authenticate user
- `GET /api/posts`: Get paginated posts
- `POST /api/posts`: Create post (multipart form-data supported)
- `PUT /api/posts/:id/like`: Toggle like
- `POST /api/posts/:id/comment`: Add comment
