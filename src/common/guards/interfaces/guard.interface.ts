import { AuthUser } from '../../../modules/auth-user/models/auth.user.model';

export interface GuardInterface extends Request {
  user: AuthUser;
}
