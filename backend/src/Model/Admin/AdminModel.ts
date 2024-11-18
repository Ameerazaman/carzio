
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  }

},{timestamps:true});

const adminModel = mongoose.model('adminModel', adminSchema);

export default adminModel;


