import { CustomerRepository } from './CustomerRepository';
import { ResultEnum } from '../types/ResultType';

const mockDB = {
  getConnection: jest.fn(),
};
const mockConnection = { query: jest.fn() };

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

beforeEach(() => {
  jest.restoreAllMocks();
  mockDB.getConnection.mockImplementationOnce(() => mockConnection);
});

describe('CustomerRepository class getCustomers method', () => {
  it('should get customers', async () => {
    mockConnection.query.mockImplementationOnce((_, cb) => {
      cb(null, mockCustomers);
    });
    const testRepo = new CustomerRepository(mockDB);
    const customersResult = await testRepo.findAll();
    expect(customersResult.type).toBe(ResultEnum.SUCCESS);
    if (customersResult.type === ResultEnum.SUCCESS) {
      expect(customersResult.value).toEqual(mockCustomers);
    }
  });

  it('should get customers error', async () => {
    const testError = new Error('bad things');
    mockConnection.query.mockImplementationOnce((_, cb) => {
      cb(testError, null);
    });
    const testRepo = new CustomerRepository(mockDB);
    const customersResult = await testRepo.findAll();
    expect(customersResult.type).toBe(ResultEnum.ERROR);
    if (customersResult.type === ResultEnum.ERROR) {
      expect(customersResult.error).toEqual(testError);
    }
  });

  it('should get a customer', async () => {
    mockConnection.query.mockImplementationOnce((_, cb) => {
      cb(
        null,
        mockCustomers.filter((c) => c.id === 0)
      );
    });
    const testRepo = new CustomerRepository(mockDB);
    const customersResult = await testRepo.findById(0);
    expect(customersResult.type).toBe(ResultEnum.SUCCESS);
    if (customersResult.type === ResultEnum.SUCCESS) {
      expect(customersResult.value).toEqual(mockCustomers[0]);
    }
  });

  it('should get a customer not found error Result', async () => {
    mockConnection.query.mockImplementationOnce((_, cb) => {
      cb(null, [
        /*mock empty customers list from db*/
      ]);
    });
    const testRepo = new CustomerRepository(mockDB);
    const customersResult = await testRepo.findById(0);
    expect(customersResult.type).toBe(ResultEnum.ERROR);
    if (customersResult.type === ResultEnum.ERROR) {
      expect(customersResult.error).toEqual(
        new Error('customer with id 0 not found')
      );
    }
  });

  it('should get customer error', async () => {
    const testError = new Error('bad things');
    mockConnection.query.mockImplementationOnce((_, cb) => {
      cb(testError, null);
    });
    const testRepo = new CustomerRepository(mockDB);
    const customersResult = await testRepo.findById(0);
    expect(customersResult.type).toBe(ResultEnum.ERROR);
    if (customersResult.type === ResultEnum.ERROR) {
      expect(customersResult.error).toEqual(testError);
    }
  });
});
