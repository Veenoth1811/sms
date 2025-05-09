import mongoose from "../config/config";

interface IUserDetails {
  name: string;
  phone: string;
  email: string;
  register: string;
}

const userDetailsSchema = new mongoose.Schema<IUserDetails>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  register: { type: String, required: true, unique: true }
});

const UserDetails = mongoose.model<IUserDetails>("UserDetails", userDetailsSchema);
export default UserDetails;
