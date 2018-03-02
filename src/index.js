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
    albums: [Albums!]
  }

  type Albums {
    userID: ID!
    id: ID!
    title: String!
    photos: [Photos!]
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
    comments: [Comments!]
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
  port: 4000
}

const resolvers = {
  Query: {
    users: async (_, { id }) => {
      const users = await fetch(`https://jsonplaceholder.typicode.com/users/${ id ? id : ''}`)
      const prUsers = await fetch(`https://jsonplaceholder.typicode.com/users/${ id ? id : ''}`)
      const prTodos = await fetch(`https://jsonplaceholder.typicode.com/todos${ id ? `?userId=${id}`: ''}`)

      const prPosts = await fetch(`https://jsonplaceholder.typicode.com/posts${ id ? `?userId=${id}`: ''}`)
      const prComments = await fetch(`https://jsonplaceholder.typicode.com/comments`)

      const prAlbums = await fetch(`https://jsonplaceholder.typicode.com/albums${ id ? `?userId=${id}`: ''}`)
      const prPhotos =  await fetch(`https://jsonplaceholder.typicode.com/photos`)

      if(id){
        const users = [await prUsers.json()]
        const todos = await prTodos.json()

        const posts = await prPosts.json()
        const comments = await prComments.json()

        const albums = await prAlbums.json()
        const photos = await prPhotos.json()

        for(i in posts){
          for(x in comments){
            if(posts[i].id === comments[x].postId){
              if(!posts[i].comments){
                Object.assign(posts[i], { comments: [comments[x]]})
              }
                posts[i].comments.push(comments[x])
            }
          }
        }

        for(i in albums) {
          for (x in photos) {
            if(albums[i].id === photos[x].albumId){
              if(!albums[i].photos){
                Object.assign(albums[i], { photos: [photos[x]]})
              }
                albums[i].photos.push(photos[x])
            }
          }
        }

        return [Object.assign(users[0], { todos }, { posts }, {albums})]
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
    albums: async (_, { id }) => {
      const pralbums = await fetch(`https://jsonplaceholder.typicode.com/albums/${id ? id : ''}`)
      const prphotos = await fetch(`https://jsonplaceholder.typicode.com/photos${id ? `?userId=${id}` : ''}`)
      if (id) {
        const albums = await pralbums.json()
        const photos = await prphotos.json()
        return [Object.assign(albums, { photos })]
      }
      return await albums.json()
    },
    comments: async (_, { id }) =>{
      const comments = await fetch('https://jsonplaceholder.typicode.com/comments/', { id : id })
      return await comments.json()
    },
    posts: async (_, { id }) =>{
      const prPosts = await fetch(`https://jsonplaceholder.typicode.com/posts/${ id ? id : ''}`)
      const prComments = await fetch(`https://jsonplaceholder.typicode.com/comments${ id ? `?postId=${id}`: ''}`)
      if(id) {
        const posts = [await prPosts.json()]
        const comments = await prComments.json()
        return [Object.assign(posts[0], {comments})]
      }
      return await prPosts.json()
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers, opts })
server.start(() => console.log(`Server is running at http://localhost:${opts.port}`))
