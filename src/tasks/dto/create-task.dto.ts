import { IsEnum, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { EnumTaskStatus } from "../interfaces/task-status.enum.interface";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(EnumTaskStatus)
    status?: EnumTaskStatus;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updateAt?: Date;
}
