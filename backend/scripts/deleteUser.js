import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const deleteUser = async () => {
  try {
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('Admin user deleted successfully');
  } catch (error) {
    console.error('Error deleting admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

deleteUser();