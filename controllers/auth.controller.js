const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlashUtil = require("../util/session-flash");

function getSignUp(req, res) {
  let sessionData = sessionFlashUtil.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      name: "",
      street: "",
      pinCode: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { inputData: sessionData });
}

async function signUp(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    confirmPassword: req.body["confirm-password"],
    name: req.body.name,
    street: req.body.street,
    pinCode: req.body["pin-code"],
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.name,
      req.body.street,
      req.body["pin-code"],
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"]) ||
    !validation.passwordIsConfirmed(
      req.body.password,
      req.body["confirm-password"]
    )
  ) {
    sessionFlashUtil.flashDataForSession(
      req,
      { errorMessage: "Please check your input", ...enteredData },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.street,
    req.body["pin-code"],
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlashUtil.flashDataForSession(
        req,
        { errorMessage: "User already exists. Try logging in", ...enteredData },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signUp();
  } catch (error) {
    return next(error);
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlashUtil.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials. Please double check your entered email and password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlashUtil.flashDataForSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsMatching = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsMatching) {
    sessionFlashUtil.flashDataForSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logOut(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/");
}

module.exports = {
  getSignUp: getSignUp,
  getLogin: getLogin,
  signUp: signUp,
  login: login,
  logOut: logOut,
};
