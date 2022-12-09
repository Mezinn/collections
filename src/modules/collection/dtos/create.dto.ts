import { TitleType } from '../../../shared/types/collection/title.type';
import { DescriptionType } from '../../../shared/types/collection/description.type';
import { IsPrivateType } from '../../../shared/types/collection/isPrivate.type';

export default class CreateDto {
  public title?: TitleType;
  public description?: DescriptionType;
  public isPrivate?: IsPrivateType;
}
