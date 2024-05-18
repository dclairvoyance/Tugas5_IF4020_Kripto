import mongoose from "mongoose";

const keySchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    sharedKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Key = mongoose.model("Key", keySchema);

export default Key;
