import mongoose, { Schema } from "mongoose";

export interface IProblem {
  bojId: number;
  level: number;
  title: string;
  tags: string[];
  averageTries: number;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
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

const Problem = mongoose.model<IProblem>("Problem", problemSchema);

export default Problem;
