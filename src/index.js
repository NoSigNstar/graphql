const fetch = require('node-fetch')
const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    users(id: ID): [Users!]
    todos(id: ID): [Todos!]
    photos(id: ID): [Photos!]
    albums(id: ID): [Albums!]
    comments(id:ID): [Comments!]
    posts(id:ID): [Posts!]
  }

  type Users {
    id: ID! 
    username: String!
    name: String!
    email: String!
    phone: String!
    website: String!
    address: Address!
    company: Company!
    posts: [Posts!]
    todos: [Todos!]
    Albums: [Albums!]
  }

  type Albums {
    userID: ID!
    id: ID!
    title: String!
  }

  type Photos {
    albumId: ID!
    id: ID!
    title: String!
    url: String!
    thumbnailUrl: String!
  }

  type Todos {
    userId: ID!
    id: ID!
    title: String!
    conpleted: Boolean!
  }

  type Posts {
    userId: ID!
    id: ID!
    title: String!
    body: String!
    comment: [Comments!]
  } 

  type Comments {
    postId: ID!
    id: ID!
    name: String!
    email: String!
    body: String!
  }

  type Address {
    street: String!
    suite: String!
    city: String!
    zipcode: String!
    geo: Geo!

  }

  type Geo {
    lat: String!
    lng: String!
  }

  type Company {
    name: String!
    catchPhrase: String!
    bs: String!
  }
`

const opts = {
  port: 4000 //configurable port no
}

const resolvers = {
  Query: {
    users: async (_, { id }) => {
      const prUsers = await fetch(`https://jsonplaceholder.typicode.com/users/${ id ? id : ''}`)
      const prTodos = await fetch(`https://jsonplaceholder.typicode.com/todos${ id ? `?userId=${id}`: ''}`)
      if(id){
        const users = [await prUsers.json()]
        const todos = await prTodos.json()
        return [Object.assign(users[0], { todos })]
      }
      return await users.json()
    },
    todos: async (_, { id }) =>{
      const todos = await fetch('https://jsonplaceholder.typicode.com/todos/', { id : id })
      return await todos.json()
    },
    photos: async (_, { id }) =>{
      const photos = await fetch('https://jsonplaceholder.typicode.com/photos/', { id : id })
      return await photos.json()
    },
    albums: async (_, { id }) =>{
      const albums = await fetch('https://jsonplaceholder.typicode.com/albums/', { id : id })
      return await albums.json()
    },
    comments: async (_, { id }) =>{
      const comments = await fetch('https://jsonplaceholder.typicode.com/comments/', { id : id })
      return await comments.json()
    },
    posts: async (_, { id }) =>{
      const posts = await fetch('https://jsonplaceholder.typicode.com/posts/', { id : id })
      return await posts.json()
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers, opts })
server.start(() => console.log(`Server is running at http://localhost:${opts.port}`))