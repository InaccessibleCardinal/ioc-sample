import { Request, Response } from 'express';
import { notFound } from './notFound';

describe('404 dummy middlware', () => {
  it('should invoke expected functions', () => {
    const req = { originalUrl: 'badpath' } as unknown as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn((body) => body),
    } as unknown as Response;
    notFound(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'resource badpath not found.',
    });
  });
});
