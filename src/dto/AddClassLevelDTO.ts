import { IsString } from 'class-validator';

class AddClassLevelDTO {
  @IsString()
  public name: string;
}

export default AddClassLevelDTO;