import { Request, Response, NextFunction } from 'express';

export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  req.isAuthenticated() ? next() : res.redirect('/');
};

export const ensureGuest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.isAuthenticated() ? res.redirect('/dashboard') : next();
};
