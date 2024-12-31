import mongoose, { Document, Model, Schema } from "mongoose";

interface SolvedProblem {
  problemId: mongoose.Types.ObjectId;
  tried: number;
  averageTries: number;
  tags: string[];
}

interface TagStatistics {
  tag: string;
  avgSolvedProblems: number;
  avgTries: number;
  count: number;
}

export interface IUser extends Document {
  id: string;
  level: number;
  solvedCnt: number;
  solvedProblems: SolvedProblem[];
  createdAt: Date;
  updatedAt: Date;
  maxStreak?: number;
}

interface UserModel extends Model<IUser> {
  getTagAverageByLevel(level: number): Promise<TagStatistics[]>;
}

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
    },
    level: {
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

userSchema.statics.getTagAverageByLevel = async function (
  level: number
): Promise<TagStatistics[]> {
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

userSchema.pre("save", function (next) {
  console.log("Pre-save validation:", {
    id: this.id,
    solvedProblemsCount: this.solvedProblems.length,
    solvedCnt: this.solvedCnt,
    level: this.level,
  });
  next();
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
