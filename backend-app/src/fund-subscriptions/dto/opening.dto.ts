import { IsNumber, IsString, Min } from "class-validator";

export class OpeningDto {

    @IsString()
    userId: string;

    @IsString()
    fundId: string;
}
