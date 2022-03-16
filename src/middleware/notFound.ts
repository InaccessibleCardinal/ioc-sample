import { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `resource ${req.originalUrl} not found.` });
}
