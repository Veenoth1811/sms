import mongoose from "../config/config";

interface IAttendance {
  name: string;
  register: string;
  status: string; // Present, Absent, or Not Marked
}

const attendanceSchema = new mongoose.Schema<IAttendance>({
  name: { type: String, required: true },
  register: { type: String, required: true, unique: true },
  status: { type: String, default: "Not Marked" }
});

const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;
