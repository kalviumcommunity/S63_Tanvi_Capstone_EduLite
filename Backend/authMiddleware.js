const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access Denied: Invalid Token Format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token payload to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
