// src/routes/movies.test.js

import { describe, it, expect } from "vitest"
import request from "supertest"
import express from "express"

import app from "../app.js"
import movies from "../data.js"

describe("GET /items/:ID", () => {

  it("returns single movie with the given id from", async () => {
    const res = await request(app).get("/items/16")
    const { ok, data } = res.body

    expect(res.status).toBe(200)
    expect(ok).toBe(true)
    expect(data).toBeDefined()
    expect(data.id).toBe(16)
    expect(data).toMatchObject({
      id: 16,
      imdb_id: expect.any(String),
      title: expect.any(String),
      year: expect.any(Number)
    })
  })

  it("returns 404 when movie is not found", async () => {
    const res = await request(app).get("/items/99999")

    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
    expect(res.body.error.code).toBe("NOT_FOUND")
  })
})
