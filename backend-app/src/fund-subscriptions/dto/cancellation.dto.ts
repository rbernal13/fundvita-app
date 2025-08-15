import { IsNumber, IsString, Min } from "class-validator";

export class CancellationDto {

    @IsString()
    fundId: string;

    @IsString()
    userId: string;

}
