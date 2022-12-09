import { EmailType } from '../../../shared/types/user/email.type';
import { UsernameType } from '../../../shared/types/user/username.type';
import { PasswordType } from '../../../shared/types/user/password.type';

export default class RegisterDto {
  public email?: EmailType;
  public username?: UsernameType;
  public password?: PasswordType;
  public confirmPassword?: PasswordType;
}
