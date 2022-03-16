import { CustomerService } from './CustomerService';

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

const mockCustomers = [{ name: 'jack' }, { name: 'jill' }];
const testService = new CustomerService(mockRepo);

describe('CustomerService class', () => {
  it('should invoke Repo.findAll', async () => {
    mockRepo.findAll.mockResolvedValueOnce(mockCustomers);
    const result = await testService.getCustomers();
    expect(result).toEqual(mockCustomers);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('should invoke Repo.findById', async () => {
    mockRepo.findById.mockResolvedValueOnce(mockCustomers[0]);
    const result = await testService.getCustomer(0);
    expect(result).toEqual(mockCustomers[0]);
    expect(mockRepo.findById).toHaveBeenCalled();
  });
});
