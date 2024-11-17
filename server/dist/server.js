import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './utils/auth.js';
// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
//get the resolved path to the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    //app.use('/graphql', expressMiddleware(server));
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken
    }));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        console.log(__dirname);
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
// Call the async function to start the server
startApolloServer();
