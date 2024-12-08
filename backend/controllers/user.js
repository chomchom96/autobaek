const User = require('../models/user');
const { default: SolvedacService } = require('../services/solvedacService');


exports.getUserSearch = async(req, res, next) => {
    const query = req.query;
    
}

exports.getUserInfo = async(req, res, next) => {
    const query = req.query;
    const users = await SolvedacService.searchUsers(query);
}