import { gql } from "apollo-server";

const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        me: User
        findUser(userId: ID!): User
        allUsers: [User]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        saveBook(bookId: String): User
        addUser (username:String!, email:String!, password: String!): Auth
        removeBook (bookId: ID!):User
    }
`;


export default typeDefs;