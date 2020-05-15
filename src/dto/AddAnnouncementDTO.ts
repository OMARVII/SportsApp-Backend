import { IsString } from 'class-validator';

class AddAnnouncementDTO {
    @IsString()
    public title: string;

    @IsString()
    public description: string;

    @IsString()
    public publishedDateTime: string;

    @IsString()
    public dueDate: string;

    public termsConditions: string[];

}

export default AddAnnouncementDTO;