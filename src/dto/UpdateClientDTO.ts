import { IsString } from 'class-validator';

class UpdateClientDTO {
    @IsString()
    public email: string;

    @IsString()
    public mobile: string;

    @IsString()
    public fullName: string;
    @IsString()
    public gender: string;

    public birthDate: {
        day: number,
        month: number,
        year: number
    };

}

export default UpdateClientDTO;