const { validateName, validateEmail, validatePassword } = require("../utils/validators");

var expect = require('chai').expect;
// const mocha = require('mocha')

describe("Testing Validators", () => {
    it("should return true for valid name", () => {
        expect(validateName("Neovim")).to.equal(true);
    });
    it("should return false for invalid name", () => {
        expect(validateName("Neovim148")).to.equal(false);
    });
    it("should return true for valid email", () => {
        expect(validateEmail("abcd@gmail.com")).to.equal(true);
    });
    it("should return false for invalid email", () => {
        expect(validateEmail("abce.gmail.com")).to.equal(false);
    });
    it("should return true for valid password", () => {
        expect(validatePassword("KnoxProcure@1509")).to.equal(true);
    });
    it("should return false for invalid password", () => {
        expect(validatePassword("knoxsecuwity")).to.equal(false);
    });
})