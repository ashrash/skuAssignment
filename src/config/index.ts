import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { DB_HOST, DB_PASSWORD, DB_USERNAME, SECRET, LOG_DIR } = process.env;
