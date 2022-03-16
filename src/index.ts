import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import bodyParser from 'body-parser';
import { DB, DBRepository } from './types/DBTypes';
import { CustomerRepository } from './repositories/CustomerRepository';
import { MysqlDB } from './repositories/MySqlDB';
import { CustomerService } from './service/CustomerService';
import { TYPES } from './types/IOCTypes';
import './controller/CustomerController';
import './controller/PostsController';
import { Customer } from './types/customer';
import { notFound } from './middleware/notFound';
import { HttpClient } from './http/HttpClient';
import { PostsService } from './service/PostsService';

const port = process.env.EXPRESS_PORT;
const container = new Container();

container.bind<DB>(TYPES.DB).to(MysqlDB);
container
  .bind<DBRepository<Customer, Error>>(TYPES.CustomerRepository)
  .to(CustomerRepository);
container.bind<CustomerService>(TYPES.CustomerService).to(CustomerService);
container.bind<HttpClient>(TYPES.HttpClient).to(HttpClient);
container.bind<PostsService>(TYPES.PostsService).to(PostsService);

const server = new InversifyExpressServer(container);

server.setConfig((application) => {
  application.use(bodyParser.json());
});

const app = server.build();
app.use('*', notFound);
app.listen(port, () => console.log(`app listenting on ${port}...`));
