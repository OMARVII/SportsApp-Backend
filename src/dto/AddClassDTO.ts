import { IsString,IsDateString,IsMongoId } from 'class-validator';

class AddClassDTO {
  @IsString()
  public name: string;

  @IsMongoId()
  public level: string;
  
  @IsMongoId()
  public branch: string;
  
  @IsMongoId()
  public type: string;
  
  
  @IsString()
  public  description : string;
  
  @IsDateString()
  public  date : Date;
  
  
}

export default AddClassDTO;