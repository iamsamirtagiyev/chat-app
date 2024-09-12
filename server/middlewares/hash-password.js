const bcrypt = require("bcrypt");

const hashPassword = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  req.body.password = hash;
  next();
};

module.exports = hashPassword;
