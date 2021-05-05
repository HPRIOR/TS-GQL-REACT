import {Request, Response} from 'express';
import {Session, SessionData} from 'express-session';

export type ContextType = {
  req: Request & { session: Session & Partial<SessionData> & { userId?: number } };
  res: Response;
} // this can be used to pass more complex types to a resolver


