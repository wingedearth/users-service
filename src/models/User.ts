import mongoose, { Document, Schema } from 'mongoose';

// Interface for the User document
export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

// User schema definition
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

// Export the model
export default mongoose.model<IUser>('User', UserSchema);
