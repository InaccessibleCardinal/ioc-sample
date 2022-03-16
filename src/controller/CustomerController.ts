import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { CustomerService } from '../service/CustomerService';
import { TYPES } from '../types/IOCTypes';
import { ResultEnum } from '../types/ResultType';
import { Request } from 'express';
import { authorize } from '../middleware/authorize';

@controller('/customers')
export class CustomerController {
  constructor(
    @inject(TYPES.CustomerService) private customerService: CustomerService
  ) {}

  @httpGet('/', authorize)
  public async getCustomers(req: Request) {
    console.log('req: ', req.body);
    const customersResult = await this.customerService.getCustomers();
    if (customersResult.type === ResultEnum.ERROR) {
      return { message: customersResult.error.message };
    }
    return { customers: customersResult.value };
  }

  @httpGet('/:id')
  public async getCustomerById(req: Request) {
    const { id } = req.params;
    const customerResult = await this.customerService.getCustomer(
      parseInt(id, 10)
    );
    if (customerResult.type === ResultEnum.ERROR) {
      return { message: customerResult.error.message };
    }
    return { customer: customerResult.value };
  }
}
