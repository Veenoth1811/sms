import mongoose from "../config/config";

interface IUserAuth {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUserAuth>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserAuth = mongoose.model<IUserAuth>("UserAuth", userSchema);
export default UserAuth;
