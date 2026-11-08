import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "assignment-three-integration-test-secret";
let app, mongo, adminToken, memberToken, adminId;
const member = {
  name: "Member",
  email: "member@example.com",
  password: "Member123!",
};
const payload = {
  title: "Portfolio project",
  firstname: "Zohaib",
  lastname: "Syed",
  email: "zo@example.com",
  completion: "2026-11-01",
  description: "A database-backed portfolio.",
};
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: "Lab3Tests" });
  const { User } = await import("../server/models/user.model.js");
  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  });
  adminId = admin.id;
  const { createApp } = await import("../server/app.js");
  app = createApp();
  adminToken = (
    await request(app)
      .post("/api/auth/signin")
      .send({ email: "admin@example.com", password: "Admin123!" })
      .expect(200)
  ).body.token;
});
after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
test("health endpoint responds", async () => {
  await request(app).get("/api/health").expect(200);
});
test("signup cannot grant admin privileges or set internal fields", async () => {
  const result = await request(app)
    .post("/api/users")
    .send({ ...member, role: "admin", tokenVersion: 77 })
    .expect(201);
  assert.equal(result.body.role, "user");
  assert.equal(result.body.password, undefined);
  assert.equal(result.body.tokenVersion, undefined);
  memberToken = (
    await request(app).post("/api/auth/signin").send(member).expect(200)
  ).body.token;
});
test("signup validates email, password, and duplicate accounts", async () => {
  await request(app)
    .post("/api/users")
    .send({ ...member, email: "invalid" })
    .expect(400);
  await request(app)
    .post("/api/users")
    .send({ ...member, email: "short@example.com", password: "short" })
    .expect(400);
  await request(app).post("/api/users").send(member).expect(409);
});
test("signin rejects invalid credentials", async () => {
  await request(app)
    .post("/api/auth/signin")
    .send({ ...member, password: "incorrect" })
    .expect(401);
  await request(app).post("/api/auth/signin").send({}).expect(400);
});
test("profile supports cookies without exposing password or token version", async () => {
  const agent = request.agent(app);
  await agent.post("/api/auth/signin").send(member).expect(200);
  const profile = await agent.get("/api/auth/profile").expect(200);
  assert.equal(profile.body.role, "user");
  assert.equal(profile.body.password, undefined);
  assert.equal(profile.body.tokenVersion, undefined);
});
test("anonymous and regular users cannot modify portfolio or access contact/user records", async () => {
  for (const resource of ["projects", "qualifications", "contacts", "users"]) {
    for (const method of ["put", "delete"]) {
      await request(app)
        [method](`/api/${resource}/${adminId}`)
        .send(payload)
        .expect(401);
      await request(app)
        [method](`/api/${resource}/${adminId}`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send(payload)
        .expect(403);
    }
    await request(app)
      .delete(`/api/${resource}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .expect(403);
    if (["contacts", "users"].includes(resource))
      await request(app)
        .get(`/api/${resource}`)
        .set("Authorization", `Bearer ${memberToken}`)
        .expect(403);
    else
      await request(app)
        .post(`/api/${resource}`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send(payload)
        .expect(403);
  }
});
for (const resource of ["projects", "qualifications"])
  test(`admin can create/read/update/delete ${resource}; everyone can read`, async () => {
    const created = await request(app)
      .post(`/api/${resource}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);
    const id = created.body._id;
    await request(app).get(`/api/${resource}`).expect(200);
    await request(app)
      .get(`/api/${resource}/${id}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .expect(200);
    const update = await request(app)
      .put(`/api/${resource}/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated title" })
      .expect(200);
    assert.equal(update.body.title, "Updated title");
    await request(app)
      .delete(`/api/${resource}/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    await request(app).get(`/api/${resource}/${id}`).expect(404);
  });
test("contact submission persists phone and message; only admin can manage it", async () => {
  const created = await request(app)
    .post("/api/contacts")
    .send({
      firstname: "Ada",
      lastname: "Lovelace",
      email: "ada@example.com",
      phone: "4165550123",
      message: "Hello from the portfolio.",
    })
    .expect(201);
  assert.equal(created.body.message, "Hello from the portfolio.");
  assert.equal(created.body.phone, "4165550123");
  const id = created.body._id;
  await request(app)
    .get(`/api/contacts/${id}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
  await request(app)
    .put(`/api/contacts/${id}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ message: "Updated message" })
    .expect(200);
  await request(app)
    .delete(`/api/contacts/${id}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);
});
test("invalid records and malformed IDs are rejected", async () => {
  await request(app)
    .post("/api/projects")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ title: "Incomplete" })
    .expect(400);
  await request(app)
    .post("/api/projects")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ ...payload, image: "https://untrusted.example/picture.png" })
    .expect(400);
  await request(app).get("/api/projects/not-an-id").expect(400);
  await request(app)
    .get("/api/auth/profile")
    .set("Authorization", "Bearer invalid")
    .expect(401);
});
test("cross-origin changes are rejected", async () => {
  await request(app)
    .post("/api/contacts")
    .set("Origin", "https://untrusted.example")
    .send({})
    .expect(403);
  await request(app)
    .get("/api/auth/signout")
    .set("Sec-Fetch-Site", "cross-site")
    .set("Authorization", `Bearer ${memberToken}`)
    .expect(403);
});
test("signout clears cookie and invalidates previously issued bearer tokens", async () => {
  const result = await request(app)
    .post("/api/auth/signout")
    .set("Authorization", `Bearer ${memberToken}`)
    .expect(200);
  assert.match(result.headers["set-cookie"][0], /portfolio_token=;/);
  await request(app)
    .get("/api/auth/profile")
    .set("Authorization", `Bearer ${memberToken}`)
    .expect(401);
});
