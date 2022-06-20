const User = require("../models/user.model");
const authUtil = require("../util/authentication");

function getSignUp(req, res) {
  res.render("customer/auth/signup");
}

async function signUp(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.street,
    req.body.postal,
    req.body.city
  );
  await user.signUp();

  res.redirect("/login");

}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

async function login(req,res){
  const user = new User(req.body.email,req.body.password);
  const existingUser = await user.getUserWithSameEmail(); 

  if(!existingUser){
    res.redirect("/login");
    return;
  }

  const passwordIsMatching = await user.hasMatchingPassword(existingUser.password);

  if(!passwordIsMatching){
    res.redirect("/login");
    return;
  }

  authUtil.createUserSession(req,existingUser,function(){
    res.redirect("/");
  });

}

function logOut(req,res){
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
