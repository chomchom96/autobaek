const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    bojId: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    averageTries: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// problemSchema.statics.getTagStatistics = async function (levelRange) {
//   return this.aggregate([
//     {
//       $match: {
//         level: {
//           $gte: levelRange.min,
//           $lte: levelRange.max,
//         },
//       },
//     },
//     { $unwind: "$tags" },
//     {
//       $group: {
//         _id: "$tags",
//         averageSolved: { $avg: "$solved" },
//         totalProblems: { $sum: 1 },
//       },
//     },
//     { $sort: { averageSolved: -1 } },
//   ]);
// };

module.exports = mongoose.model("Problem", problemSchema);
