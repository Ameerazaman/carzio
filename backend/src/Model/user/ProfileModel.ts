
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  name:{
    type:String
  },
  email:{
    type:String
  },
  phone:{
    type:Number
  },
  adharNo:{
    type:Number
  },
  gender:{
    type:String
  },
},{timestamps:true});

const UserProfileModel = mongoose.model('UserProfileModel', profileSchema);

export default UserProfileModel;
