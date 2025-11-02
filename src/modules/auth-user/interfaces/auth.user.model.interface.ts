// import { RefreshToken } from '../../refresh-token/models/refresh.token.model';
// import { Player } from '../../player/models/player.model';

import { RegTypeEnum, UserPresenceStatusEnum } from '../../../common/enums';
import { UserTypes } from '../../../common/enums/user.types';

export interface AuthUserModelInterface {
  uuid?: string;
  userType: UserTypes;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  passwordHash?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  hasVerifiedOTP?: boolean;
  presenceStatus?: string | UserPresenceStatusEnum;
  otp?: string | null;
  otpExpiresAt?: string | Date | null;
  signupChannel?: RegTypeEnum;
  profilePic?: string | null;
  remarks?: string | null;
}
