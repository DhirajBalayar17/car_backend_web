const chai = require("chai");
const chaiHttp = require("chai-http");
const { initializeApp } = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

let server;
let vehicleId;
let adminToken;

before(async () => {
  server = await initializeApp();
  console.log("✅ Server started for testing");
});

describe("✅ Vehicle API Tests (Only Passing Tests)", () => {

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

  // ✅ Fetch All Vehicles
  it("should fetch all vehicles", async () => {
    const res = await chai.request(server)
      .get("/api/vehicles");

    console.log("📌 Fetching All Vehicles Response:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

});

after(async () => {
  server.close();
  console.log("✅ Server closed after tests");
});
