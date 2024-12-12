const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    avgLevel: {
      type: Number,
      required: true,
    },
    solvedCnt: {
      type: Number,
      required: true,
    },
    solvedProblems: [
      {
        problemId: {
          type: Schema.Types.ObjectId,
          ref: "Problem",
        },
        tried: {
          type: Number,
          required: true,
        },
        averageTries: {
          type: Number,
          required: true,
        },
        tags: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.getTagAverageByLevel = async function (level) {
  return this.aggregate([
    {
      $match: {
        avgLevel: level,
      },
    },
    {
      $unwind: "$solvedProblems",
    },
    {
      $unwind: "$solvedProblems.tags",
    },
    {
      $group: {
        _id: "$solvedProblems.tags",
        avgSolvedProblems: {
          $avg: "$solvedProblems.length",
        },
        avgTries: {
          $avg: "$solvedProblems.tried",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        avgSolvedProblems: -1,
      },
    },
    {
      $project: {
        tag: "$_id",
        avgSolvedProblems: 1,
        avgTries: 1,
        count: 1,
        _id: 0,
      },
    },
  ]);
};

// 리턴값
// [{
// tag: "dynamic-programming",
// avgSolvedProblems: 5.2, 
// avgTries: 2.3,
// count: 15
// },]

module.exports = mongoose.model("User", userSchema);
