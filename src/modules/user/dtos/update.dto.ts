import { UsernameType } from '../../../shared/types/user/username.type';
import { FirstNameType } from '../../../shared/types/user/firstName.type';
import { LastNameType } from '../../../shared/types/user/lastName.type';

export default class UpdateDto {
  public username?: UsernameType;
  public firstName?: FirstNameType;
  public lastName?: LastNameType;
}
