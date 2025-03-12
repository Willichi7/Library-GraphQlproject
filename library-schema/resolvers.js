require('dotenv').config()
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const DataLoader = require('dataloader')

const batchBooks = async (authorIds) => {
   const books = await Book.find({ author: { $in: authorIds } })
   const booksByAuthor = authorIds.map(authorId => 
      books.filter(book => book.author.toString() === authorId.toString())
   )
   return booksByAuthor
}

const bookLoader = new DataLoader(batchBooks)

const resolvers = {
   Query: {
      dummy: () => 0,
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
         console.log('Book.find')
         let filter = {}
         if (args.author) {
            const author = await Author.findOne({ name: args.author })
            filter.author = author ? author._id : null
         }
         if (args.genre) {
            filter.genres = { $in: [args.genre] }
         }
         return Book.find(filter).populate('author')
      },
      allAuthors: async () => Author.find({}),
      me: (root, args, context) => {
          return context.currentUser
        }
      },

      Author: {
        bookCount: async (root) => {
          const books = await bookLoader.load(root.id)
          return books.length
        }
      },

      Mutation: {
        addBook: async (_, args, context) => {
         let author = await Author.findOne({ name: args.author })
         const currentUser = context.currentUser
         if (!author) {
            author = new Author({ name: args.author })
            await author.save()
         }

         const book = new Book({ ...args, author: author._id })
        
         if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
          }

         try {
            await book.save()
            currentUser.favoriteGenre = currentUser.favoriteGenre
            await currentUser.save()
          } catch (error) {
            throw new GraphQLError('Saving book failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                error
              }
            })
          }
          pubsub.publish('BOOK_ADDED', {bookAdded: book})
          return book.populate('author')
        },
        editBirth: async (root, args, context) => {
           const author = await Author.findOne({ name: args.name })
           const currentUser = context.currentUser
           if (!author) {
            return null
           }
           if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
               code: 'BAD_USER_INPUT',
              }
            })
            }
           author.born = args.setBorn
           
           try {
            await author.save()
            } catch (error) {
            throw new GraphQLError('Saving number failed', {
              extensions: {
               code: 'BAD_USER_INPUT',
               invalidArgs: args.name,
               error
              }
            })
            }
            return author
         },
         createUser: async (root, args) => {
          let user = new User({...args})

          await user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
               extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
               }
             })
          })
          return user
        },
        login: async (root, args) => {
         const user = await User.findOne({username: args.username})
         if(!user || args.password !== 'secret'){
            throw new GraphQLError('wrong credentials', {
              extensions: {
                code: 'BAD_USER_INPUT'
              }
            })        
         }

         const userForToken = {
         username: user.username,
         id: user._id
         }

         return {value: jwt.sign(userForToken, process.env.SECRET)}
      },
   },
   Subscription: {
      bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      },
   },
}

module.exports = resolvers
