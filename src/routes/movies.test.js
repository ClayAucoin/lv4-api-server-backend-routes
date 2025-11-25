// src/routes/movies.test.js

import { describe, it, expect } from "vitest"
import request from "supertest"
import express from "express"

import moviesRouter from "./movies.js"
import movies from "../data.js"

const router = express()
router.use(express.json())
router.use(moviesRouter)

describe("GET /movies", () => {
  it("returns the movies from data.js", async () => {
    const res = await request(router).get("/")
    const { ok, data } = res.body

    expect(res.status).toBe(200)
    expect(ok).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toEqual(movies)
  })

  it("returns an array of movie objects with the right shape", async () => {
    const res = await request(router).get("/")
    const { ok, data } = res.body

    expect(res.status).toBe(200)
    expect(ok).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(movies.length)

    data.forEach((movie) => {
      expect(movie).toMatchObject({
        id: expect.any(Number),
        imdb_id: expect.any(String),
        title: expect.any(String),
        year: expect.any(Number),
      })
    })
  })

  it("includes Monkey Man in the list", async () => {
    const res = await request(router).get("/")
    const { ok, data } = res.body

    expect(res.status).toBe(200)
    expect(ok).toBe(true)
    expect(data).toContainEqual(
      expect.objectContaining({
        title: "Monkey Man",
        imdb_id: "tt9214772",
      })
    )
  })
})
