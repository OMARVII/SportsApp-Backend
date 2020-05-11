import { IsString,IsDateString } from 'class-validator';

class AddClassDTO {
  @IsString()
  public name: string;

  @IsString()
  public level: string;
  
  @IsString()
  public place: string;
  
  @IsString()
  public type: string;
  
  
  @IsString()
  public  description : string;
  
  @IsDateString()
  public  date : Date;
  
  
}

export default AddClassDTO;