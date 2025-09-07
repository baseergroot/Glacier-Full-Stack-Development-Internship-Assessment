import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

// Export Model using ES6 syntax
const User = mongoose.model('User', userSchema);

// Export the User model
export default User
