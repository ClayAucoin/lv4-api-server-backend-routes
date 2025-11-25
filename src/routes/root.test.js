// src/routes/root.test.js

import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express"
import rootRouter from "./root.js"

const route = express()
route.use(express.json())
route.use(rootRouter)

describe("Server root route", () => {
  it("serves HTML from root route", async () => {
    const res = await request(route).get("/")

    expect(res.status).toBe(200)
    expect(res.text).toContain("<h1>Express Running</h1>")
    expect(res.headers["content-type"]).toMatch(/html/)
  })
})