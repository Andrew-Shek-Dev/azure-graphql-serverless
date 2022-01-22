import { listQuotes, createQuote, deleteQuote } from './handlers';
 
export default {
  Query: {
    listQuotes
  },
  Mutation: {
    createQuote,
    deleteQuote
  }
};