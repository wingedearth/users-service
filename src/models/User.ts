import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Enum for user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Interface for the User document
export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toAuthJSON(): object;
  isAdmin(): boolean;
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
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password field by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: [true, 'User role is required']
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        'Please enter a valid phone number'
      ]
    },
    address: {
      street: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Street address cannot be more than 100 characters']
      },
      city: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'City cannot be more than 50 characters']
      },
      state: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'State cannot be more than 50 characters']
      },
      zipCode: {
        type: String,
        required: false,
        trim: true,
        maxlength: [20, 'Zip code cannot be more than 20 characters']
      },
      country: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Country cannot be more than 50 characters']
      }
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Remove password from JSON output
        return ret;
      }
    }
  }
);
// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user is admin
UserSchema.methods.isAdmin = function(): boolean {
  return this.role === UserRole.ADMIN;
};

// Create JSON response with auth token
UserSchema.methods.toAuthJSON = function() {
  const json: any = {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role
  };
  
  // Include optional fields if they exist
  if (this.phoneNumber) {
    json.phoneNumber = this.phoneNumber;
  }
  
  if (this.address) {
    json.address = this.address;
  }
  
  return json;
};
// Export the model
export default mongoose.model<IUser>('User', UserSchema);
