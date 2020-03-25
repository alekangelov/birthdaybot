import { Schema, model } from "mongoose";

var blogSchema = new Schema({
  member: Number,
  guild: Number,
  birthday: String,
  timestamps: { createdAt: Date, updatedAt: Date }
});

export default model("Birthday", blogSchema);
