import { IsString } from 'class-validator';

class RateClassDTO {
  @IsString()
  public rate: number;

  @IsString()
  public feedback: string;
}

export default RateClassDTO;