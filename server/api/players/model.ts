import { model, Schema } from "npm:mongoose@^6.7";

// Define schema.
const playerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export model.
export default model("Dinosaur", playerSchema);
