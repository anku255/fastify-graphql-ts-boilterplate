import fastify from 'fastify'
import { ApolloServer } from 'apollo-server-fastify';
import cors from 'cors'
import { IncomingMessage, ServerResponse } from 'http'
import graphqlSchema from './graphql/schema'
import authMiddleware from './middlewares/authentication'
import './config/database';
import userRoutes from './api/user/routes'

const app = fastify();

const gqlServer = new ApolloServer({
  schema: graphqlSchema,
  context: (ctx) => ({
    user: ctx.req.user
  })
});

function getHelloHandler(_: fastify.FastifyRequest<IncomingMessage>,
  reply: fastify.FastifyReply<ServerResponse>): void {
  reply.header('Content-Type', 'application/json').code(200)
  reply.send({ hello: 'world' })
}

app.use(cors());
app.use(authMiddleware);
app.get('/', getHelloHandler);
app.register(userRoutes);

app.get('/error', async (request, reply) => {

  throw new Error('Some error');
  reply.send('done');
})


app.setErrorHandler(function (error, request, reply) {
  reply.code(error.statusCode || 500).send({ message: error.message || "Interval Server Error" })
});


(async (): Promise<void> => {
  try {
    await app.register(gqlServer.createHandler()).listen(process.env.PORT);
    console.log(`API Server listening on  http://localhost:${process.env.PORT}`)
    console.log(`GraphQL Server listening on  http://localhost:${process.env.PORT}/graphql`)
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();