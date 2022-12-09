import { EmailType } from '../../../shared/types/user/email.type';
import { PasswordType } from '../../../shared/types/user/password.type';

export default class LoginDto {
  public email?: EmailType;
  public password?: PasswordType;
}
