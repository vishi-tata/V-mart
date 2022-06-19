function getSignUp(req, res) {
    res.render("customer/auth/signup");
}

function getLogin(req, res) {}

module.exports = {
  getSignUp: getSignUp,
  getLogin: getLogin,
};
