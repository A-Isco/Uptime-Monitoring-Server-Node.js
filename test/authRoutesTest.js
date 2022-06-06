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
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjliMDdiN2FmNWRiZDc3ODM3MmEyNWQiLCJlbWFpbCI6Im5vdmF0cnkyMDIwMUBnbWFpbC5jb20iLCJpYXQiOjE2NTQzMzA3MTF9.13q3oA9KVhRthpBnnjN29dYTOgxkSOznTAHe5lNANC8";

describe("Test of Auth Routes", async () => {
  // Connect to db first
  before(async () => {
    await connectDB(process.env.MONGO_URI);
  });

  // ********************** Signup Testing **************************

  describe("Signup route /api/auth/signup", () => {
    // Signup Successfully
    it("Signup Successfully", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: "signupNewAccount@gmail.com",
          password: "123456789",
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    // Signup with duplicate account
    it("Signup with duplicate account", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: "novatry20201@gmail.com",
          password: "123456789",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("User already exists");

          done();
        });
    });

    // Signup With Invalid Mail
    it("Signup With Invalid Mail", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: "gggggggggggggggg",
          password: "123456789",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(`"email" must be a valid email`);
          done();
        });
    });

    // Signup Without Password
    it("Signup Without Password", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email: "testingnopass@gmail.com",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(`"password" is required`);
          done();
        });
    });
  });

  // ********************** Login Testing **************************

  describe("Login route /api/auth/login", () => {
    // Login With Correct Data
    it("Correct Login Data", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          email: "novatry20201@gmail.com",
          password: "123456789",
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    // Login With Wrong Password
    it("Wrong Password", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          email: "novatry20201@gmail.com",
          password: "123456",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("Invalid password");
          done();
        });
    });

    // Login With Wrong User Email
    it("Wrong User Email", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          email: "novat88@gmail.com",
          password: "123456789",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("User not found");
          done();
        });
    });

    // Login With Unverified User Email
    it("Unverified User Email", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          email: "notVerifiedTesting@gmail.com",
          password: "123456789",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "User is not verified, please verify and login"
          );
          done();
        });
    });
  });

  // ********************** Verification Testing **************************
  describe("Verification route /api/auth/verify", () => {
    // Verify a new account
    it("Verify a new account", (done) => {
      chai
        .request(server)
        .post("/api/auth/verify")
        .send({
          email: "verifingTesting@gmail.com",
          verificationCode: "100903",
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.be.eq("User is verified, login");
          done();
        });
    });

    // Verify not existing user
    it("Verify not existing user", (done) => {
      chai
        .request(server)
        .post("/api/auth/verify")
        .send({
          email: "sdsads@gmail.com",
          verificationCode: "104855",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("User not found");
          done();
        });
    });

    // Already Verified User
    it("Already Verified User", (done) => {
      chai
        .request(server)
        .post("/api/auth/verify")
        .send({
          email: "novatry20201@gmail.com",
          verificationCode: "104855",
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq("User is already verified, please login");
          done();
        });
    });
  });
});
