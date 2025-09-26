import { readFileSync } from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'src/graphql/schema');

export const typeDefs = [
  readFileSync(path.join(schemaPath, 'base.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'user.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'friend.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'friendRequest.graphql'), 'utf8'),
  readFileSync(path.join(schemaPath, 'message.graphql'), 'utf8'),
];
