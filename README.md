# Expert Session Booking

This repo contains two parts:

- `backend/` — Node.js + Express + MongoDB backend
- `frontend/` — React + Vite frontend

Node.js backend for a real-time expert booking system.

## Features

- Expert listing with search, filter, and pagination
- Expert detail retrieval
- Booking creation with race-condition-safe prevention of duplicate slots
- Booking status update
- Booking lookup by email
- Real-time slot updates using Socket.io

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   npm run install-client
   ```
4. Seed sample experts:
   ```bash
   npm run seed
   ```
5. Run both backend and frontend together:
   ```bash
   npm run dev-all
   ```

> Or run them separately:
> - Backend: `npm run dev`
> - Frontend: `npm run client`

> The frontend uses `VITE_API_URL` from `frontend/.env` to connect to the backend.

## API Endpoints

- `GET /api/experts`
- `GET /api/experts/:id`
- `POST /api/bookings`
- `GET /api/bookings?email=`
- `PATCH /api/bookings/:id/status`

## Real-time Updates

Clients can connect to Socket.io and join the expert room with:

- `joinExpertRoom` event carrying the expert ID

When a slot is booked, the server emits:

- `slotBooked` with `{ expertId, date, timeSlot, bookingId }`
