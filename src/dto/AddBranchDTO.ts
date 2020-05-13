import { IsString } from 'class-validator';

class AddBranchDTO {
    @IsString()
    public place: string;

    @IsString()
    public latitude: string;

    @IsString()
    public longitude: string;
}

export default AddBranchDTO;