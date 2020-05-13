import { IsString } from 'class-validator';

class AddClassTyoeDTO {
  @IsString()
  public name: string;
}

export default AddClassTyoeDTO;