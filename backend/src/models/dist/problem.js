"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var problemSchema = new mongoose_1.Schema({
    bojId: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [
        {
            type: String,
            required: true
        },
    ],
    averageTries: {
        type: Number,
        required: true
    }
}, { timestamps: true });
var Problem = mongoose_1["default"].model("Problem", problemSchema);
exports["default"] = Problem;
