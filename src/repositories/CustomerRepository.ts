import { inject, injectable } from 'inversify';
import { Connection } from 'mysql2';
import { Customer } from '../types/customer';
import { DB, DBRepository } from '../types/DBTypes';
import { TYPES } from '../types/IOCTypes';
import { ResultEnum, ResultType } from '../types/ResultType';

type CustomersResult = ResultType<Customer[], Error>;
type CustomerResult = ResultType<Customer, Error>;

@injectable()
export class CustomerRepository implements DBRepository<Customer, Error> {
  private connection: Connection;

  public constructor(@inject(TYPES.DB) private db: DB) {
    this.connection = this.db.getConnection();
  }

  findAll(): Promise<CustomersResult> {
    const queryString = `select * from ${process.env.DB_TABLE}`;
    return new Promise((resolve) => {
      this.connection.query(queryString, (err, result) => {
        if (err) {
          console.log('error querying: ', err);
          resolve({ type: ResultEnum.ERROR, error: err });
        } else {
          resolve({ type: ResultEnum.SUCCESS, value: result as Customer[] });
        }
      });
    });
  }

  findById(id: number): Promise<CustomerResult> {
    const queryString = `select * from ${process.env.DB_TABLE} where id = ${id}`;
    return new Promise((resolve) => {
      this.connection.query(queryString, (err, result) => {
        if (err) {
          resolve({ type: ResultEnum.ERROR, error: err });
        } else {
          if ((result as any).length === 1) {
            resolve({
              type: ResultEnum.SUCCESS,
              value: (result as any)[0] as Customer,
            });
          } else {
            resolve({
              type: ResultEnum.ERROR,
              error: new Error(`customer with id ${id} not found`),
            });
          }
        }
      });
    });
  }
}
