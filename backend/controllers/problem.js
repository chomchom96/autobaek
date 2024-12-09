const Problem = require("../models/problem");
const { SolvedacService } = require("../services/solvedacService");

exports.searchUser = async (req, res, next) => {
  const query = req.query;
  const user = await SolvedacService.searchUsers(query);
  return user;
};

exports.getUserInfo = async (req, res, next) => {
  const handle = req.id;

  user.save().then((user) => {
    return user;
  });
};
