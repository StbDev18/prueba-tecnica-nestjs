import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SigninUserDto {

    @ApiProperty({
        example: 'example@example.com',
        description: 'Auth email',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Password123',
        description: 'Auth password'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}
