import User from '../../models/User';

const userCreateOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['fullName', 'email'],
      properties: {
        fullName: { type: 'string' },
        email: { type: 'string' },
      }
    }
  }
}

export default function (fastify, opts, done) {
  fastify.get('/users', async (request, reply) => {
    const users = await User.find();
    return reply.send(users);
  });

  fastify.post('/users', userCreateOptions, async (req, reply) => {
    const newUser = await new User(req.body).save();
    return reply.send(newUser);
  })

  done()
}