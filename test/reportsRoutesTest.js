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

describe("Test of Reports Routes", async () => {
  // Connect to db first
  before(async () => {
    await connectDB(process.env.MONGO_URI);
  });

  // ********************** Get Report by Check Id Testing **************************
  const checkIdForTesting = "629b155e2e6f82a0ec790d08";
  const checkIdNotInDb = "629b155e2e6f82a0ec666666";

  describe("Get Report by Check Id route  Get /api/reports/:checkId", () => {
    // Get Report by Check Id successfully
    it("Get Report by Check Id successfully", (done) => {
      chai
        .request(server)
        .get(`/api/reports/${checkIdForTesting}`)
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    // Get Report by Check Id failed (No check with that id)
    it("Get Report by Check Id failed (No check with that id)", (done) => {
      chai
        .request(server)
        .get(`/api/reports/${checkIdNotInDb}`)
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "Report not found , There's no check with that id"
          );
          done();
        });
    });
  });

  // ********************** Get All Reports Testing **************************
  describe("Get All Reports route  Get /api/reports", () => {
    // Get All Reports successfully
    it("Get All Reports successfully", (done) => {
      chai
        .request(server)
        .get("/api/reports")
        .set("Authorization", token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });

    const userIdHasNoReportsToken =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjliOGUxZDUyY2EzMWZjNmZiMTExYjUiLCJlbWFpbCI6Im5vQ2hla3NVc2VyQGdtYWlsLmNvbSIsImlhdCI6MTY1NDQxODc5OX0.5SBoNaCe_zXuUM9xlLRdTKqmcaScmhU1V6LlbyxwHRA";

    // Get All Reports Failed ( No reports found)
    it("Get All Reports Failed ( No reports found)", (done) => {
      chai
        .request(server)
        .get("/api/reports")
        .set("Authorization", userIdHasNoReportsToken)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("No reports found");
          done();
        });
    });
  });

  // ********************** Get Reports by Tags Testing **************************

  describe("Get Reports by Tags POST /api/reports/tags", () => {
    // Get Reports by Tags successfully
    it("Get Reports by Tags successfully", (done) => {
      chai
        .request(server)
        .post("/api/reports/tags")
        .set("Authorization", token)
        .send({
          tags: ["vip"],
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });

    // Get Reports by Tags Failed (No Reports with these Tags)
    it("Get Reports by Tags Failed (No Reports with these Tags)", (done) => {
      chai
        .request(server)
        .post("/api/reports/tags")
        .set("Authorization", token)
        .send({
          tags: ["dummyTag"],
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("No reports for these tag(s)");
          done();
        });
    });
  });
});
