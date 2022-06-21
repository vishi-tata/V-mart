function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return email && email.includes("@") && password && password.trim().length > 5;
}

function userDetailsAreValid(email, password, name, street, pinCode, city) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(pinCode) &&
    !isEmpty(city)
  );
}

function emailIsConfirmed(email, confirmEmail){
    return email === confirmEmail;
}

function passwordIsConfirmed(password, confirmPassword){
  return password === confirmPassword;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    emailIsConfirmed: emailIsConfirmed,
    passwordIsConfirmed: passwordIsConfirmed,
}
