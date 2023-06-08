const jwt = require("jsonwebtoken");
const createError = require("./error");

/* ------------------------------ Verifiy Token ----------------------------- */
const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token;
  // if (!token) return next(createError(401, "You are not authenticated"));

  // jwt.verify(token, process.env.JWT, (err, user) => {
  //   if (err) return next(createError(403, "Token is not valid!"));
  //   req.user = user;
  //   next();
  // });

  try {
    let token = req.headers.token || req.cookies.access_token || req?.headers["authorization"];
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token?.length);
      }
      jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
      });
    } else {
      return next(createError(401, "Token is missing"));
    }
  } catch (error) {
    return next(createError(401, "You are not authenticated"));
  }
};

/* ------------------------------- Verify User ------------------------------ */
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

/* ------------------------------ Verify Admin ------------------------------ */
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
