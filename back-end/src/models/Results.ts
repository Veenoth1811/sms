import mongoose from "../config/config";

interface IResults {
  name: string;
  register: string;
  marks: {
    Tamil: number;
    English: number;
    Maths: number;
    Science: number;
    Social: number;
  };
  total: number;
  grade: string;
  status: string;
}

const resultsSchema = new mongoose.Schema<IResults>({
  name: { type: String, required: true },
  register: { type: String, required: true, unique: true },
  marks: {
    Tamil: { type: Number, default: 0 },
    English: { type: Number, default: 0 },
    Maths: { type: Number, default: 0 },
    Science: { type: Number, default: 0 },
    Social: { type: Number, default: 0 },
  },
  total: { type: Number, default: 0 },
  grade: { type: String, default: "Pending" },
  status: { type: String, default: "Pending" },
});

const Results = mongoose.model<IResults>("Results", resultsSchema);
export default Results;
