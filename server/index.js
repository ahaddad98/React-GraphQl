const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    name: String!
    age: Int!
  }

  type Query {
    users: [User]
    getUser(name: String!): User
  }

  type Mutation {
    addUser(name: String!, age: Int!): User
    updateUser(name: String!, age: Int!): User
  }
`;

let users = [
  { name: 'test1', age: 21 },
  { name: 'test2', age: 21 },
  { name: 'test3', age: 21 },
  { name: 'test4', age: 21 },
  { name: 'test5', age: 21 },
];

const resolvers = {
  Query: {
    users: () => users,
    getUser: (_, { name }) => users.find(user => user.name === name),
  },
  Mutation: {
    addUser: (_, { name, age }) => {
      if (users.some(user => user.name === name)) {
        throw new Error("User with this name already exists.");
      }
      const newUser = { name, age };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { name, age }) => {
      const userIndex = users.findIndex(user => user.name === name);
      if (userIndex === -1) {
        throw new Error("User not found.");
      }
      users[userIndex].age = age;
      return users[userIndex];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
