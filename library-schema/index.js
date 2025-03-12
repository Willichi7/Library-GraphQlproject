require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const mongoose = require ('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
mongoose.set('strictQuery', false)

const MONGO_URI = process.env.MONGO_URI
console.log('connected to ', MONGO_URI)
mongoose.connect(MONGO_URI)
   .then(() => {
   console.log('Connecting to MongoDB')
}).catch((error) => {
   console.log('Error connecting to MongoDB', error.message)
})

mongoose.set('debug', true)


const start = async () => {
   const app = express()
   const httpServer = http.createServer(app)
 
   const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
   })
 
   const schema = makeExecutableSchema({typeDefs, resolvers})
   const serverCleanUp = useServer({schema}, wsServer)
 
   const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer}), 
     {
       async serverWillStart() {
        return {
         async drainServer() {
           await serverCleanUp.dispose()
         }
        }
       }
     }
    ]
   })
 
   await server.start()
 
   app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
     context: async ({ req }) => {
       const auth = req ? req.headers.authorization : null
       if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
        const currentUser = await User.findById(decodedToken.id).populate('favoriteGenre')
        return { currentUser }
       }
       return {}
     }
    })
   )
 
   const PORT = 4000
 
   httpServer.listen(PORT, () => 
    console.log(`Server is now running on http://localhost:${PORT}`)
   )
 }
 
 start()
 