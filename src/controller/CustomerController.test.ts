import { Request } from 'express';
import { CustomerService } from '../service/CustomerService';
import { ResultEnum } from '../types/ResultType';
import { CustomerController } from './CustomerController';

const mockService = {
  getCustomers: jest.fn(),
  getCustomer: jest.fn(),
} as unknown as CustomerService;

const mockCustomers = [
  {
    firstname: 'jen',
    lastname: 'smith',
    email: 'abc@a.com',
    password: 'pass',
    id: 0,
  },
  {
    firstname: 'ben',
    lastname: 'smith',
    email: 'bca@a.com',
    password: 'pass2',
    id: 1,
  },
];

describe('CustomerController class', () => {
  it('should get customers', async () => {
    const mockRequest = { body: null } as Request;
    const testController = new CustomerController(mockService);
    (mockService.getCustomers as jest.Mock).mockResolvedValueOnce({
      type: ResultEnum.SUCCESS,
      value: mockCustomers,
    });

    const result = await testController.getCustomers(mockRequest);
    expect(result).toEqual({ customers: mockCustomers });
  });

  it('should get customers error', async () => {
    const testError = new Error('bad customers');
    const mockRequest = { body: null } as Request;
    const testController = new CustomerController(mockService);
    (mockService.getCustomers as jest.Mock).mockResolvedValueOnce({
      type: ResultEnum.ERROR,
      error: testError,
    });

    const result = await testController.getCustomers(mockRequest);
    expect(result).toEqual({ message: 'bad customers' });
  });

  it('should get a customer by id', async () => {
    const mockRequest = { params: { id: 0 } } as unknown as Request;
    const testController = new CustomerController(mockService);
    (mockService.getCustomer as jest.Mock).mockResolvedValueOnce({
      type: ResultEnum.SUCCESS,
      value: mockCustomers[0],
    });

    const result = await testController.getCustomerById(mockRequest);
    expect(result).toEqual({ customer: mockCustomers[0] });
  });

  it('should get a customer by id error', async () => {
    const testError = new Error('bad customer');
    const mockRequest = { params: { id: 0 } } as unknown as Request;
    const testController = new CustomerController(mockService);
    (mockService.getCustomer as jest.Mock).mockResolvedValueOnce({
      type: ResultEnum.ERROR,
      error: testError,
    });

    const result = await testController.getCustomerById(mockRequest);
    expect(result).toEqual({ message: 'bad customer' });
  });
});
