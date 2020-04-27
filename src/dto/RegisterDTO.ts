import { IsString } from 'class-validator';

class RegisterDTO {
  @IsString()
  public email: string;

  @IsString()
  public password: string;
  
  @IsString()
  public mobile: string;

  @IsString()
  public fullName: string;
  
}

export default RegisterDTO;