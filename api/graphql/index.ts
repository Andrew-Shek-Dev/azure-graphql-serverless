import { ApolloServer } from 'apollo-server-azure-functions';
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
 
const server = new ApolloServer({ typeDefs, resolvers });
export default server.createHandler();