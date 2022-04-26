import { HttpError } from './http-error';


export interface OpResult<T = any> {
  data: T;
  error?: HttpError;
}
