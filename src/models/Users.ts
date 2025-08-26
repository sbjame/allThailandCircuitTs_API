import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  user_Name: string;
  first_Name: string;
  last_Name: string;
  email: string;
  password: string;
  token: string;
  role: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  update_at: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    user_Name: { type: String, required: true, default: null},
    first_Name: { type: String, required: true, default: null},
    last_Name: {type: String, required: true, default: null},
    email: {type: String, required: true, default: null},
    password: {type: String, requied: true},
    token: String,
    role: {type: String, enum: ["user", "manager", "admin"], default: "user"},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date},
    update_at: {type: Date, default: Date.now}
});

export const User = mongoose.model<IUser>("User", UserSchema);