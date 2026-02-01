import dotenv from 'dotenv';

const env = process.env.ENV || 'qa';

dotenv.config({
  path: `.env.${env}`,
});

console.log(`🔧 ENV loaded: ${env}`);