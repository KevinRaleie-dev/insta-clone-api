import { Payload } from '@_types/mod';
import { Request, Response } from 'express';

export interface Context {
    req: Request;
    res: Response;
    payload?: Payload;
}