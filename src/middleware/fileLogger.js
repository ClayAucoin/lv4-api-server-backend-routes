// src/middleware/fileLogger.js

import fs from "fs"
import path from "path"

const logFile = path.join(process.cwd(), "src/logs.txt")

export default function fileLogger(req, res, next) {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start

    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms\n`

    fs.appendFile(logFile, log, (err) => {
      if (err) console.log("log write error:", err)
    })
  })

  next()
}
