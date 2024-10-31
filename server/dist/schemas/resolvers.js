// import { AuthenticationError } from "apollo-server";
// import User from "../models/User";
const resolvers = {
    Query: {
        me: async () => {
            console.log('hi');
        }
    },
    Mutation: {}
};
export default resolvers;
