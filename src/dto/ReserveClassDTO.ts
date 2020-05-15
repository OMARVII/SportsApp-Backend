import { IsMongoId } from 'class-validator';

class ReserveClassDTO {
  @IsMongoId()
  public id:string;
}

export default ReserveClassDTO;