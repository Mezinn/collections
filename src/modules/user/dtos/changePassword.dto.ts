import { PasswordType } from '../../../shared/types/user/password.type';

export default class ChangePasswordDto {
  public oldPassword?: PasswordType;
  public password?: PasswordType;
  public confirmPassword?: PasswordType;
}
