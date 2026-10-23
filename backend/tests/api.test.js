import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import http from "http";
import app from "../app.js";

describe("YouTube Clone Backend API Test Suite", () => {
  let server;
  let baseUrl;

  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
  });

  test("GET /api/health should return status ok with 200", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "ok");
    assert.ok(data.timestamp);
  });

  test("GET /api/movie/get should return 200 and success true", async () => {
    const res = await fetch(`${baseUrl}/api/movie/get?limit=5`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
  });

  test("GET /api/category/get should return 200 with category list", async () => {
    const res = await fetch(`${baseUrl}/api/category/get`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
  });

  test("GET /api/cast/get should return 200 with cast list", async () => {
    const res = await fetch(`${baseUrl}/api/cast/get`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
  });

  test("Protected route /api/history without token should return 401", async () => {
    const res = await fetch(`${baseUrl}/api/history`);
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });
});
