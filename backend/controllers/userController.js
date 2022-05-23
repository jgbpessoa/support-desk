const registerUser = (req, res) => {
  res.send("Register User");
};

const loginUser = (req, res) => {
  res.send("Login User");
};

module.exports = {
  registerUser,
  loginUser,
};
