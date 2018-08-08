// import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test1');

const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean
});
 
const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type Todo {
    id: ID!
    text: String!
    complete: String!
  }
  type Mutation {
    createTodo(text: String): Todo
  }
`
 
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
  Mutation: {
    createTodo: async (_,{text}) => {
      const todo = new Todo({text, complete: false});
      await todo.save();
      return todo;
    }
  }
}
 
const server = new GraphQLServer({ typeDefs, resolvers })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  server.start(() => console.log('Server is running on localhost:4000'))
});