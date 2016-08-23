function isValidPassword(password) {
  if (!password) {
    return false;
  }
  if (password.length < 8 || password.length > 16) {
    return false;
  }
  return true;
}


module.exports = isValidPassword;
