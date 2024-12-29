import mongoose, { Schema } from "mongoose";
const problemSchema = new Schema({
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
}, { timestamps: true });
const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
