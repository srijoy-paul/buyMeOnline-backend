const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require("../index");

const API_BASE_URL = process.env.BASE_SERVER_URL;

chai.use(chaiHttp);

describe("/POST testing user signup", () => {
    it("creates a new user", (done) => {
        chai.request(API_BASE_URL).post("/api/v1/user/signup").send({
            name: "Silvus CoperNikus",
            email: "Silvus1995@gmail.com",
            password: "siloper$CoNius897",
            isSeller: false
        }).end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.contain("Welcome! Silvus CoperNikus");
            res.body.should.have.property("createdUser");
            done();
        });
    });
});
