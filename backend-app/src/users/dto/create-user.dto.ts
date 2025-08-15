import { IsString, IsNumber, IsEmail, Min } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    balance: number;
}
