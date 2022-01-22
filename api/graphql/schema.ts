import { gql } from 'apollo-server-azure-functions';
export default /* GraphQL */ gql`
# GraphQL Schema
type Quote {
  id: ID
  source: String
  text: String
}
input CreateQuoteInput {
  source: String!
  text: String!
}
type Query {
  listQuotes: [Quote]!
}
type Mutation {
  createQuote(input: CreateQuoteInput!): Quote
  deleteQuote(id: ID!): Quote 
}
# End Schema
`