const jwt = require("jsonwebtoken");


// =========================================================
// AUTHENTICATE JWT
// =========================================================

const authenticateToken = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

    }


    const token =
      authHeader
        .slice(7)
        .trim();


    if (!token) {

      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

    }


    if (
      !process.env.JWT_SECRET
    ) {

      console.error(
        "JWT_SECRET is not configured."
      );


      return res.status(500).json({
        success: false,
        message:
          "Server authentication is not configured.",
      });

    }


    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    if (
      !decoded ||
      !decoded.userId
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });

    }


    req.user = decoded;


    next();

  } catch (error) {

    if (
      error.name ===
        "TokenExpiredError"
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Your session has expired. Please login again.",
      });

    }


    if (
      error.name ===
        "JsonWebTokenError"
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });

    }


    console.error(
      "Authentication middleware error:",
      error
    );


    return res.status(401).json({
      success: false,
      message:
        "Authentication failed.",
    });

  }
};


module.exports = {
  authenticateToken,
};