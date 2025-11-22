import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class ActionMedia {

    @ApiProperty({
        type: 'number',
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    like: number;

    @ApiProperty({
        type: 'number',
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    download: number;

    @ApiProperty({
        type: 'number',
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    listen: number
}