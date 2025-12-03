// src/routes/movies.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import data from "../data.js"

const router = express.Router()

router.get("/", (req, res, next) => {
  console.log("GET /movies")
  res.status(200).json({
    ok: true,
    data: data
  })
})

export default router