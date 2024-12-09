const User = require("../models/user");
const { SolvedacService } = require("../services/solvedacService");

exports.searchUser = async (req, res, next) => {
  const query = req.query;
};

exports.getUserInfo = async (req, res, next) => {
  const userId = req.id;
  const user = await SolvedacService.searchUsers(userId);
  user.save().then((user) => {
    // 푼 문제 정보 get ->
    // 유저 정보 + 태그별 문제 수 배열로 반환
    return user;
  });
};
