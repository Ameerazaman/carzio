
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default:false
  },
  username:{
    type:String
  }

});

const userModel = mongoose.model('userModel', userSchema);

export default userModel;
