import { Request, Response } from 'express';
import { authorize } from './authorize';

describe('authorize dummy middlware', () => {
  it("should modify the request and call 'next()'", () => {
    const req = { body: '' } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();
    authorize(req, res, next);
    expect(req.body).toBe('some stuff');
    expect(next).toHaveBeenCalled();
  });
});
