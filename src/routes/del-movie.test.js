// src/routes/del-movie.test.js

import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import express from "express"

import app from "../app.js"
import { deleteMovieById } from "./del-movie.js"
import { sendError } from "../utils/sendError.js"
import data from "../data.js"


const originalMovies = JSON.parse(JSON.stringify(data))

beforeEach(() => {
  data.length = 0
  data.push(...JSON.parse(JSON.stringify(originalMovies)))
})

describe("DELETE /del-movie/:id", () => {
  it("deletes a movie successfully", async () => {
    const res = await request(app).delete("/movies/8")

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.message).toBe("Movie deleted successfully")
    expect(res.body.data.id).toBe(8)

    const find = data.find((m) => m.id === 8)
    expect(find).toBeUndefined()
  })

  it("returns 404 when movie does not exist", async () => {
    const res = await request(app).delete("/del-movie/9999")

    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
    expect(res.body.error.code).toBe("NOT_FOUND")
  })
})

it("returns null if -1", () => {
  const err = deleteMovieById(-1)
  expect(err).toBeNull
})