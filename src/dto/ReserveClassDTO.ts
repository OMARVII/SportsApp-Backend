import { IsString } from 'class-validator';

class ReserveClassDTO {
  @IsString()
  public id:string;
}

export default ReserveClassDTO;