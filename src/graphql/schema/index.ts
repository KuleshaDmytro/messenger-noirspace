import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from '../resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schemaPath = path.join(process.cwd(), 'src/graphql/schema');

export const typeDefs = [
  // readFileSync(path.join(schemaPath, 'base.graphql'), 'utf8'),
  // readFileSync(path.join(schemaPath, 'query.graphql'), 'utf8'),
  // readFileSync(path.join(schemaPath, 'mutation.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'subscription.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'user.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'friend.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'friendRequest.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'message.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'conversation.graphql'), 'utf8'),
];

export const schema = makeExecutableSchema({ typeDefs, resolvers });

