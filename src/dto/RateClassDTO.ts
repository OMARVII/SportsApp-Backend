import { IsString,IsNumber,IsMongoId } from 'class-validator';

class RateClassDTO {

  @IsNumber()
  public rate: number;

  @IsString()
  public feedback: string;
  
  @IsMongoId()
  public id: string;

}

export default RateClassDTO;