const jwt = require("jsonwebtoken");

const verifiedToken = (req, res, next) => {
  const token = req.header("Authorization");
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: "token non presente",
    });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    res.status(403).send({
      statusCode: 403,
      message: "token non valido o scaduto!",
    });
  }
};

module.exports = verifiedToken;