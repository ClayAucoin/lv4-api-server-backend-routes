// src/index.js
import express from "express"
import cors from "cors"

// utils
import { sendError } from "./utils/sendError.js"

// middleware
import fileLogger from "./middleware/fileLogger.js"
import colorLogger from "./middleware/colorLogger.js"

// import routes
import rootRouter from "./routes/root.js"
import moviesRouter from "./routes/movies.js"
import findMovieRouter from "./routes/find-movie.js"
import addMovieRouter from "./routes/add-movie.js"
import delMovieRouter from "./routes/del-movie.js"

const app = express();
// const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// middleware: use log files
app.use(fileLogger)
app.use(colorLogger)

// use routes
app.use("/", rootRouter)
app.use("/movies", moviesRouter)
app.use("/movies", findMovieRouter)
app.use("/movies", addMovieRouter)
app.use("/movies", delMovieRouter)


export function globalErrorHandler(err, req, res, next) {
  const status = err.status || 500
  const code = err.code || "INTERNAL_ERROR"
  const message = err.message || "Server error"

  const payload = {
    ok: false,
    error: {
      status,
      message,
      code
    }
  }

  if (err.details) {
    payload.error.details = err.details
  }

  res.status(status).json(payload)
}

export function error404(req, res, next) {
  next(sendError(404, "Route not found", "NOT_FOUND"))
}

// routes error 404
app.use(error404)

// global error handling
app.use(globalErrorHandler)

export default app