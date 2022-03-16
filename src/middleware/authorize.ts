import { NextFunction, Request, Response } from 'express';

export function authorize(req: Request, res: Response, next: NextFunction) {
  req.body = 'some stuff';
  next();
}
