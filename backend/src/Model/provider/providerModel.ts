
import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
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
  token:{
    type:String
  },
  username:{
    type:String
  },
  image:{
    type:String
  }

});

const providerModel = mongoose.model('providerModel', providerSchema);

export default providerModel;
