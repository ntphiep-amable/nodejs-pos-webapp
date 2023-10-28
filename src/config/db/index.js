const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/point_of_sale', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('\nConnect to DB successfully !!!');
  } catch (error) {
    console.log('\nConnect to DB failed !!!');
    console.log(error);
  }
};

module.exports = { connect };