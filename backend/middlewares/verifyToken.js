const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "invalide token, accesss denied " });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token provided, access denied" });
  }
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next){
    verifyToken(req, res, () => {
        if(req.user.isAmin) {
            next();
        } else {
            return res.status(403).json({message: "not allowd, only admin"});
        }
    })
}

// Verify Token & Only User Himself
function verifyTokenAndOnlyUser(req, res, next){
  verifyToken(req, res, () => {
      if(req.user.id == req.params.id) {
          next();
      } else {
          return res.status(403).json({message: "not allowd, only User Himself"});
      }
  })
}

// Verify Token & Authorization
function verifyTokenAndAuthorization(req, res, next){
  verifyToken(req, res, () => {
      if(req.user.id == req.params.id || req.user.isAdmin) {
          next();
      } else {
          return res.status(403).json({message: "not allowd, only User Himself"});
      }
  })
}

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};