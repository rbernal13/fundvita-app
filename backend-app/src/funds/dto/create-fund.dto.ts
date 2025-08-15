import { IsNumber, IsString } from "class-validator";

export class CreateFundDto {

    @IsString()
    name: string;

    @IsNumber()
    minInvestment: number;

    @IsString()
    category: string;
}
