const chai = require("chai");
const chaiHttp = require("chai-http");
const { initializeApp } = require("../index"); // Ensure correct import
const { expect } = chai;

chai.use(chaiHttp);

let server; 
let userId;
let token;
let adminToken;

before(async () => {
  console.log("🛠 Initializing test server...");
  server = await initializeApp();
  console.log("✅ Server started for testing");
});

describe("User API Tests", () => {
  
  // ✅ Test: Register a New User
  it("should register a new user", async () => {
    const res = await chai.request(server)
      .post("/api/users/register")
      .send({
        username: "TestUser",
        email: "testuser@example.com",
        password: "Test@1234",
        phone: "9876543210",
        role: "user"
      });

    if (res.status === 400) {
      console.log("User already exists, skipping registration.");
      expect(res.body.message).to.equal("Email already registered");
    } else {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property("message").equal("User registered successfully");
      userId = res.body.user._id;
    }
  });

  // ✅ Test: Login User & Store Token
  it("should log in the user and return a token", async () => {
    const res = await chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "Test@1234"
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
    token = res.body.token; 
  });

  // ✅ Test: Login Admin & Store Token
  it("should log in an admin", async () => {
    const res = await chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "dhirajbalayar0@gmail.com", 
        password: "12345"
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
    adminToken = res.body.token;
  });

  // ✅ Test: Get All Users (Requires Admin Token)
  it("should get all users", async () => {
    const res = await chai.request(server)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`); 

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  // ✅ Test: Get User by ID
  it("should fetch user by ID", async () => {
    if (!userId) {
      console.log("Skipping test: No user ID available");
      return;
    }

    const res = await chai.request(server)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("username").equal("TestUser");
  });

  // ✅ Test: Update User Profile
  it("should update user details", async () => {
    if (!userId) {
      console.log("Skipping test: No user ID available");
      return;
    }

    const res = await chai.request(server)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "UpdatedTestUser",
        phone: "9812345678"
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Profile updated successfully");
    expect(res.body.user.username).to.equal("UpdatedTestUser");
  });

  // ✅ Test: Prevent Unauthorized User Deletion
  it("should NOT allow non-admin user to delete another user", async () => {
    if (!userId) {
      console.log("Skipping test: No user ID available");
      return;
    }

    const res = await chai.request(server)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(403); 
  });

  // ✅ Test: Delete a User (Admin Access Required)
  it("should allow an admin to delete a user", async () => {
    if (!userId) {
      console.log("Skipping test: No user ID available");
      return;
    }

    const res = await chai.request(server)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message").equal("User deleted successfully");
  });

});

// ✅ Close the Server After Tests
after(async () => {
  console.log("🛑 Closing test server...");
  if (server) {
    server.close();
    console.log("✅ Server closed");
  } else {
    console.error("❌ Server was undefined, could not close.");
  }
});
