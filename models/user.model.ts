import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "student" | "admin" | "instructor";
  avatar?: string;
  bio?: string;
  // Academic
  college?: string;
  branch?: string;
  cgpa?: number;
  graduationYear?: number;
  // Professional
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  resumeUrl?: string;
  isBlocked: boolean;
  isDeleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },
    avatar: { type: String },
    bio: { type: String },
    // Academic
    college: { type: String },
    branch: { type: String },
    cgpa: { type: Number },
    graduationYear: { type: Number },
    // Professional
    phone: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
