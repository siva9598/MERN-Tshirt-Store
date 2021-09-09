var express = require("express");
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

router.get("/signout", signout);
router.post(
  "/signup",
  [
    check("name", "name should be atleast 3 charecters").isLength({ min: 3 }),
    check("password", "password should be atleast 5  charecter").isLength({
      min: 5,
    }),
    check("email", "email should be valid").isEmail(),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("password", "password field is mandatory").isLength({
      min: 1,
    }),
    check("email", "email should be valid").isEmail(),
  ],
  signin
);
router.get("/testroute", isSignedIn, (req, res) => {
  res.send("A protected route");
});

module.exports = router;
