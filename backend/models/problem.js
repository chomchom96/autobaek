const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  bojId: {
    type: Number,
    required: true,
  },
  difficulty: {
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
    }
  ],
  createdAt: {
    type: Date,
    required: true,
  },
});

export default problemSchema;