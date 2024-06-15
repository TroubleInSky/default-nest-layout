import { IJwtPayload } from './jwt-payload.interface';

export interface IAuthorizedRequest extends Request {
  user: IJwtPayload;
}
