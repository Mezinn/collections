import { ValueType } from '../../../shared/types/resetPasswordToken/value.type';
import { PasswordType } from '../../../shared/types/user/password.type';

export default class ResetPasswordDto {
  public token?: ValueType;
  public password?: PasswordType;
  public confirmPassword: PasswordType;
}
