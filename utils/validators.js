const validateName = (name) => {
    const nameRegex = new RegExp(/[a-zA-Z][a-zA-Z]+[a-zA-Z]$/);
    return nameRegex.test(name);
}

const validateEmail = (email) => {
    const emailRegex = new RegExp(
        /^[A-Za-z0-9_!#$%&'*+\/=?'{|}~^.-]+@[A-Za-z0-9.-]+$/,
        "gm"
    );
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegx = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    console.log(passwordRegx.test(password));
    return passwordRegx.test(password);
}

module.exports = { validateName, validateEmail, validatePassword };