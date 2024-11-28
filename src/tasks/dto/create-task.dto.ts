import { IsEnum, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { EnumTaskStatus } from "../interfaces/task-status.enum.interface";

export class CreateTaskDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
    
    @IsOptional()
    @IsEnum(EnumTaskStatus)
    status?: EnumTaskStatus;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updateAt?: Date;
}
