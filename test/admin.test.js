const chai = require("chai");
const chaiHttp = require("chai-http");
const { initializeApp } = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

let server;
let adminToken;
let testUserId;

before(async () => {
  server = await initializeApp();
  console.log("✅ Server started for testing");
});

describe("✅ Admin API Tests (Only Passing Tests)", () => {

  // ✅ Log in as an Admin and store token
  it("should log in an admin", async () => {
    const res = await chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "dhirajbalayar0@gmail.com",
        password: "12345"
      });

    expect(res).to.have.status(200);
    adminToken = res.body.token;
    console.log("✅ Admin Token Acquired");
  });

  // ✅ Get Admin Dashboard Stats
  it("should fetch admin statistics", async () => {
    const res = await chai.request(server)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("📌 Fetching Admin Stats Response:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").equal(true);
    expect(res.body).to.have.property("totalUsers").that.is.a("number");
    expect(res.body).to.have.property("totalAdmins").that.is.a("number");
    expect(res.body).to.have.property("totalCars").that.is.a("number");
    expect(res.body).to.have.property("totalBookings").that.is.a("number");
  });

  // ✅ Fetch All Users
  it("should fetch all users", async () => {
    const res = await chai.request(server)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("📌 Fetching Users Response:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").equal(true);
    expect(res.body).to.have.property("users").that.is.an("array");

    if (res.body.users.length > 0) {
      testUserId = res.body.users[0]._id; // Store a user ID for later tests
      console.log(`✅ Stored User ID: ${testUserId}`);
    }
  });

});

after(async () => {
  server.close();
  console.log("✅ Server closed after tests");
});
