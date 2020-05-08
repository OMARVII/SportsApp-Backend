import { IsString } from 'class-validator';

class AddClassDTO {
  @IsString()
  public name: string;

  @IsString()
  public level: string;
  
  @IsString()
  public place: string;
  
  @IsString()
  public type: string;
  
}

export default AddClassDTO;