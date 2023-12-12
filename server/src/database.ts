import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/partners');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default connectDatabase;
``
