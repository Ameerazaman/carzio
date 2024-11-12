
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  houseName:{
    type:String
  },
  street:{
    type:String
  },
  city:{
    type:String
  },
  state:{
    type:String
  },
  district:{
    type:String
  },
  zip:{
    type:String
  }

});

const UserAddressModel = mongoose.model('UserAddressModel', addressSchema);

export default UserAddressModel;
