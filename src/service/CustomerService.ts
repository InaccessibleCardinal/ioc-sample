import { inject, injectable } from 'inversify';
import { Customer } from '../types/customer';
import { DBRepository } from '../types/DBTypes';
import { TYPES } from '../types/IOCTypes';

@injectable()
export class CustomerService {
  private customerRepository: DBRepository<Customer, Error>;

  public constructor(
    @inject(TYPES.CustomerRepository)
    customerRepository: DBRepository<Customer, Error>
  ) {
    this.customerRepository = customerRepository;
  }

  getCustomers() {
    return this.customerRepository.findAll();
  }

  getCustomer(id: number) {
    return this.customerRepository.findById(id);
  }
}
