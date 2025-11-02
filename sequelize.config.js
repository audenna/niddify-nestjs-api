require('dotenv').config();

module.exports = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  sync: process.env.DB_SYNC,
  logging: process.env.NODE_ENV !== 'production',
};
