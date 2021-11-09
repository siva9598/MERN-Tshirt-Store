const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "No user found in DB" });
    }
    req.profile = user;
    //console.log("user is " + user);
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.putUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, userFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not allowed to modify the data of this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      return res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Oder.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "You are not allowed to modify the data of this user",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }, //this will return the updated object
    (err, purchases) => {
      if (err || !purchases) {
        return res.status(400).json({
          error: "Unable to save purchase list ",
        });
      }
      next();
    }
  );
};
