
const typeDefs = `

   type Subscription {
     bookAdded: Book!
   } 

   type User {
      username: String!
      favoriteGenre: String!
      id: ID!
   }

   type Token {
      value: String!
   }

   type Book {
      title: String!
      published: Int!
      author: Author!
      id: ID!
      genres: [String!]!
   }

   type Author {
      name: String!
      id: ID!
      born: Int
      bookCount: Int!
   }

   type Mutation {
      addBook (
         title: String!
         published: Int!
         author: String!
         genres: [String!]!
      ): Book
      editBirth(
         name: String!
         setBorn: Int!
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
         username: String!
         password: String!
      ): Token
   }
      
   type Query {
      dummy: Int
      bookCount: Int!
      authorCount: Int!
      allBooks (author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
   }
`

module.exports = typeDefs