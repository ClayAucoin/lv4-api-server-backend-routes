// src/middleware/colorLoger.js

// src/middleware/colorLogger.js
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m"
};

export default function colorLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    let color = colors.green;

    if (res.statusCode >= 500) color = colors.red;
    else if (res.statusCode >= 400) color = colors.yellow;

    console.log(
      `${color}${req.method} ${req.path} ${res.statusCode} - ${duration}ms${colors.reset}`
    );
  });

  next();
}
