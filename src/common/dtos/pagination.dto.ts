import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        example: 10,
        description: 'How many rows do you need',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // hace la conversion a numero
    limit?: number;

    @ApiProperty({
        example: 0,
        description: 'How many rows do you want to skip',
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number) // hace la conversion a numero
    offset?: number
}