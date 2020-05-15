import { IsString,IsNumber,IsMongoId,ArrayMinSize, IsArray } from 'class-validator';
import {Types} from 'mongoose'
class ClassFilterDTO {
  @IsArray()
  public levels: string[];

  @IsArray()
  public types: string[];
  
  @IsArray()
  public branches: string[];

}

export default ClassFilterDTO;