let app = require("../app");
let chai = require("chai");
let chaiHttp = require("chai-http");
require("dotenv").config();
const connectDB = require("../db/connectDB");

const server = app;

// Assertion Style
chai.should();

chai.use(chaiHttp);

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjliMDdiN2FmNWRiZDc3ODM3MmEyNWQiLCJlbWFpbCI6Im5vdmF0cnkyMDIwMUBnbWFpbC5jb20iLCJpYXQiOjE2NTQzNTkwNDV9.Koed13gI6ZGHKP1Nfx2sx7iaRzTOqXZi-p6rAvn3kS8";

describe("Test of Checks Routes", async () => {
  // Connect to db first
  before(async () => {
    await connectDB(process.env.MONGO_URI);
  });

  // ********************** Create Check Testing **************************

  describe("Create Check route POST /api/checks", () => {
    // Creat an existent check with same name and url
    it("Creat an existent check with same name and url", (done) => {
      chai
        .request(server)
        .post("/api/checks")
        .set("Authorization", token)
        .send({
          name: "novayyyy23",
          url: "https://www.youtube.com/",
          protocol: "HTTP",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("Check already exists");
          done();
        });
    });

    // Creat a check without Url
    it("Creat a check without Url", (done) => {
      chai
        .request(server)
        .post("/api/checks")
        .set("Authorization", token)
        .send({
          name: "novayyyy23",
          protocol: "HTTP",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(`"url" is required`);
          done();
        });
    });

    // Creat a check without Name
    it("Creat a check without Name", (done) => {
      chai
        .request(server)
        .post("/api/checks")
        .set("Authorization", token)
        .send({
          url: "https://www.youtube.com/",
          protocol: "HTTP",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(`"name" is required`);
          done();
        });
    });
  });

  // ********************** Get All Checks Testing **************************
  const noChecksUserToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjliOGUxZDUyY2EzMWZjNmZiMTExYjUiLCJlbWFpbCI6Im5vQ2hla3NVc2VyQGdtYWlsLmNvbSIsImlhdCI6MTY1NDM2MTY2M30.pcVXBRshr8z6uXxVy2rSCjl7-gCrRU63V9IcGW_KD8w";

  describe("Get All Checks route Get /api/checks", () => {
    // Get all checks successfully
    it("Get all checks successfully", (done) => {
      chai
        .request(server)
        .get("/api/checks")
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });

    // Get all checks fails (User has no checks)
    it("Get all checks fails (User has no checks)", (done) => {
      chai
        .request(server)
        .get("/api/checks")
        .set("Authorization", noChecksUserToken)
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq("No URLs to check");
          done();
        });
    });
  });

  // ********************** Get a single Check Testing **************************
  const checkIdForTesting = "629b155e2e6f82a0ec790d08";
  const checkIdNotInDb = "629b155e2e6f82a0ec666666";

  describe("Get A Single Check route Get /api/checks/:id", () => {
    // Get a single check successfully
    it("Get a single check successfully", (done) => {
      chai
        .request(server)
        .get(`/api/checks/${checkIdForTesting}`)
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    // Get a single check failed (No check with this id)
    it("Get a single check failed (No check with this id)", (done) => {
      chai
        .request(server)
        .get(`/api/checks/${checkIdNotInDb}`)
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("Check not found");
          done();
        });
    });
  });

  // ********************** Update Check Testing **************************
  const checkIdForUpdateTesting = "629ba39ecb0e28d1bfe1b35d";

  describe("Update Check route PATCH /api/checks/:id", () => {
    // Update check successfully
    it("Update check successfully", (done) => {
      chai
        .request(server)
        .patch(`/api/checks/${checkIdForUpdateTesting}`)
        .set("Authorization", token)
        .send({
          name: "updatedCheckName",
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq("Check updated successfully");
          done();
        });
    });

    // Update check failed (check not found)
    it("Update check failed (check not found)", (done) => {
      chai
        .request(server)
        .patch(`/api/checks/${checkIdNotInDb}`)
        .set("Authorization", token)
        .send({
          name: "updatedCheckName2",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("Check not found");
          done();
        });
    });
  });

  // ********************** Delete Check Testing **************************
  const checkIdForDeleteTest = "629cf9699cc0f2821a8a65f8";

  describe("Delete Check route DELETE /api/checks/:id", () => {
    // Delete check successfully
    it("Delete check successfully", (done) => {
      chai
        .request(server)
        .delete(`/api/checks/${checkIdForDeleteTest}`)
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq(
            "Check and its report have been successfully deleted"
          );
          done();
        });
    });

    // Delete check failed (check not found)
    it("Delete check failed (check not found)", (done) => {
      chai
        .request(server)
        .delete(`/api/checks/${checkIdNotInDb}`)
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("Check not found");
          done();
        });
    });
  });
});
