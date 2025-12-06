# API Server Routes & Tests

## Persistent data on disk

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Middleware & Error Handling](#middleware--error-handling)
  - [Logging](#logging)
  - [Validation](#validation)
  - [Error Utility](#error-utility)
  - [Global Error Handler](#global-error-handler)
- [API Endpoints](#api-endpoints)
  - [GET /](#get-)
  - [GET /movies](#get-movies)
  - [GET /movies/:id](#get-moviesid)
  - [POST /movies](#post-movies)
  - [DELETE /movies/:id](#delete-moviesid)
- [Testing](#testing)
- [Notes & Limitations](#notes--limitations)

## Overview

This project is a small Express-based API server that exposes a read / add / delete interface for an in-memory movie collection. It includes reusable validation middleware, a typed error utility, and centralized error handling, along with route-level tests written in Vitest and Supertest. The server also logs each request to both the console and a log file.

The API is designed for learning and practice: it uses a static `data.js` file as a fake database and focuses on clean routing, consistent JSON responses, and testable behavior at the route and middleware level.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Environment config:** `dotenv` via `src/config.js`
- **Testing:** Vitest + Supertest
- **Logging:**
  - `colorLogger` (console, colored by status code)
  - `fileLogger` (appends to `src/logs.txt`)

## Project Structure

```text
.
└── src/
    ├── app.js
    ├── config.js
    ├── data.js
    ├── index.js
    │
    ├── middleware/
    │   ├── colorLogger.js
    │   ├── fileLogger.js
    │   └── validators.js
    │
    ├── routes/
    │   ├── root.js
    │   ├── movies.js
    │   ├── find-movie.js
    │   ├── add-movie.js
    │   └── del-movie.js
    └── utils/
        └── sendError.js
```

Tests live alongside these modules:

```text
src/
  middleware/
    validators.test.js

  routes/
    root.test.js
    movies.test.js
    find-movies.test.js
    add-movie.test.js
    del-movie.test.js

  utils/
    sendError.test.js
```

## Configuration

Environment configuration is handled in `src/config.js` using `dotenv`:

- **`PORT`** (default: `3000`)
- **`NODE_ENV`** (default: `development`)
- **`API_KEY`** (optional)
- **`DB_URL`** (optional)

## Running the Server

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file if you want to override defaults:

   ```bash
   PORT=3000
   NODE_ENV=development
   ```

3. Start the server:

   ```bash
   npm start
   ```

   or:

   ```bash
   node src/index.js
   ```

The server logs each request to:

- The terminal via `colorLogger`
- `src/logs.txt` via `fileLogger`

## Middleware & Error Handling

### Logging

- **`fileLogger`** logs timestamp, HTTP method, URL, status code, and total duration.
- **`colorLogger`** prints colored logs based on status category (<400 green, 400–499 yellow, 500+ red).

Both are applied globally in `app.js`.

### Validation

`src/middleware/validators.js` exposes:

- **`validateId`**

  - Ensures `req.params.id` is a positive integer.
  - Provides structured error codes on failure.

- **`validateMovieBody`**
  - Ensures a POST body exists.
  - Requires `title` and `year`.
  - Validates `year` is numeric and >= 1900.

### Error Utility

`sendError(status, message, code = "ERROR", details = null)` produces a structured error object used across the API.

### Global Error Handler

`globalErrorHandler` returns consistent JSON error output:

```json
{
  "ok": false,
  "error": {
    "status": 400,
    "message": "Error message",
    "code": "SOME_CODE",
    "details": {}
  }
}
```

A catch-all `404` handler returns:

```json
{
  "ok": false,
  "error": {
    "status": 404,
    "message": "Route not found",
    "code": "NOT_FOUND"
  }
}
```

## API Endpoints

Base URL: `http://localhost:3000`

---

### GET `/`

Returns an HTML health check page.

**Response:** `200 OK`

---

### GET `/movies`

Returns the entire movie list from `src/data.js`.

**Response:**

```json
{
  "ok": true,
  "data": [
    /* array of movies */
  ]
}
```

---

### GET `/movies/:id`

Retrieves a single movie by ID.

- Uses `validateId`
- Returns `404` if not found

**Response:**

```json
{
  "ok": true,
  "data": {
    /* movie */
  }
}
```

---

### POST `/movies`

Adds a new movie. Requires:

```json
{
  "title": "string",
  "year": 2024
}
```

**Success response:**

```json
{
  "ok": true,
  "message": "Movie added successfully",
  "data": {
    /* new movie */
  }
}
```

---

### DELETE `/movies/:id`

Deletes a movie.

- Uses `validateId`
- Returns `404` if nonexistent

**Response:**

```json
{
  "ok": true,
  "message": "Movie deleted successfully",
  "data": {
    /* deleted movie */
  }
}
```

## Testing

The suite uses **Vitest + Supertest** and covers:

- Validation middleware
- Error utility
- All route behaviors
- Successful and failing cases
- Shape and consistency of response bodies

Run tests with:

```bash
npx vitest
```

or:

```bash
npx vitest run
```

## Notes & Limitations

- The “database” is an in-memory array and resets whenever the server restarts.
- IDs increment based on array length and may contain gaps after deletions.
- This project is intended for practice, demonstrations, and Express fundamentals.
