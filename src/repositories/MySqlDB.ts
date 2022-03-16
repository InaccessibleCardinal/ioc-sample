import mysql, { Connection } from 'mysql2';
import { DB } from '../types/DBTypes';
import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
dotenv.config();

@injectable()
export class MysqlDB implements DB {
  private connection: Connection;

  constructor() {
    this.connection = this.connectToDB();
  }

  getConnection() {
    if (this.connection) {
      return this.connection;
    }
    return this.connectToDB();
  }

  connectToDB() {
    try {
      return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
      });
    } catch (err) {
      console.log('connection error', err);
      throw err;
    }
  }
}
