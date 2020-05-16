import { IsString } from 'class-validator';

class AddPushTokenDTO {
    @IsString()
    public token: string;
}

export default AddPushTokenDTO;