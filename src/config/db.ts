import mongoose from 'mongoose';

export const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDb Connected : ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
