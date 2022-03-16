import { Connection } from 'mysql2';
import { ResultType } from './ResultType';

export interface DB {
  getConnection(): Connection;
}

export interface DBRepository<T, E extends Error> {
  findAll(): Promise<ResultType<T[], E>>;

  findById(id: number): Promise<ResultType<T, E>>;
}
