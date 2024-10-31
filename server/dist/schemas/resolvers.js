import { AuthenticationError } from "apollo-server-express"; // Correct import for AuthenticationError
import User from "../models/User";
import { signToken } from "../services/auth";
const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).select('-__v -password');
                return user;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        addUser: async (_parent, args) => {
            const user = await User.create(args);
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        // Example for login mutation, added for completeness
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Invalid credentials');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        // Save a book (added for completeness)
        saveBook: async (_, { authors, description, title, bookId, image, link }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } }, { new: true }).select('-__v -password');
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
        // Remove a book (added for completeness)
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true }).select('-__v -password');
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
};
export default resolvers;
