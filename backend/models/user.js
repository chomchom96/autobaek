const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  solvedProblems: [{ type: Schema.Types.ObjectId, ref: "Problem" }],
});

export default userSchema;
