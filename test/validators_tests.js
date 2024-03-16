const { validateName, validateEmail, validatePassword } = require("../utils/validators");

var expect = require('chai').expect();
// const mocha = require('mocha')

describe("Testing Validators", () => {
    it("should return true for valid name", () => {
        expect(validateName("Neovim")).to.equal(true);
    });
    it("should return false for invalid name", () => {
        expect(validateName("Neovim148")).to.equal(false);
    });
})