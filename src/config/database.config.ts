import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  dbUri: process.env.MONGO_URI,
}));
