import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { BookResolver } from './resolvers/book-resolver';
import { OrderResolver } from './resolvers/order-resolver';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Express from 'express';
import { WishlistResolver } from './resolvers/wishlist-resolver';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const resolvers = [BookResolver, OrderResolver, WishlistResolver] as const;
  const schema = await buildSchema({
    resolvers,
    orphanedTypes: [],
    emitSchemaFile: true,
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  const app = Express();

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () => {
    console.log(
      `🚀 Server is running: GraphQL playground available at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
}

// Catch errors here and report them... maybe logging?
bootstrap().catch((err) => console.log(err, 'error'));
