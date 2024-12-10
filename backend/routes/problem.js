const express = require("express");

const problemController = require("../controllers/problem");

const router = express.Router();

router.get("/recommend", problemController.recommendProblem);
