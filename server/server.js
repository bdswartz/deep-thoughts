const path = require('path');
// import express and Apollo
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

// establish PORT variable 
const PORT = process.env.PORT || 3001;

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Create express app variable
const app = express();

// establish parsing to handle gettig info to right format
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets from the React client/build directory when in 
// the production environment (will happen automatically on Heroku if there is
// a "build" script in the package.json)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  // this creates a /graphql endpoint
  server.applyMiddleware({ app });

  // open server connection
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      })
    })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
