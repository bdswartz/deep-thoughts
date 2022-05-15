const mongoose = require('mongoose');

// Create server connection to MONGODB_URI if using Mongo Atlas OR deep-thoughts locally
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/deep-thoughts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// export connection
module.exports = mongoose.connection;
