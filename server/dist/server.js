import express from 'express';
// import path from 'node:path';
import db from './config/connection.js';
// import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = async () => {
    await server.start();
    await db();
    const PORT = process.env.PORT || 3001;
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    // app.use(routes);
    app.use('/graphql', expressMiddleware(server));
    // if we're in production, serve client/build as static assets
    // if (process.env.NODE_ENV === 'production') {
    //   app.use(express.static(path.join(__dirname, '../client/dist')));
    // }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
// Call the async function to start the server
startApolloServer();