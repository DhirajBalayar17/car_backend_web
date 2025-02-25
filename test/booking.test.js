const chai = require("chai");
const chaiHttp = require("chai-http");
const { initializeApp } = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

let server;
let adminToken;
let userToken;

before(async () => {
  server = await initializeApp();
  console.log("✅ Server started for testing");
});

describe("Booking API Tests", () => {

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
  });

  // ✅ Log in as a User and store token
  it("should log in a user", async () => {
    const res = await chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "Test@1234"
      });

    expect(res).to.have.status(200);
    userToken = res.body.token;
  });

  // ✅ Get all bookings (Admin Only)
  it("should fetch all bookings", async () => {
    const res = await chai.request(server)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

});

after(async () => {
  server.close();
  console.log("✅ Server closed after tests");
});
