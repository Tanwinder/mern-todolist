// import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test1');

const todoSchema = new mongoose.Schema({
  text: String,
  complete: Boolean
})

const Todo = mongoose.model("Todo", todoSchema);
 
const typeDefs = `
  type Query {
    hello(name: String): String!
    getTodo: [Todo]
  }
  type Todo {
    id: ID!
    text: String!
    complete: String!
  }
  type Mutation {
    createTodo(text: String): Todo
    updateTodo( id: ID!, complete: Boolean): Boolean
    deleteTodo( id: ID!): Boolean
  }
`
 
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    getTodo: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, complete: false});
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, complete }) => {
      await Todo.findByIdAndUpdate(id, {complete});
      return true;
    },
    deleteTodo: async (_, {id}) => {
      await Todo.findByIdAndRemove(id);
      return true;
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