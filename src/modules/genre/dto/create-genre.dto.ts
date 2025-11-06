import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGenreDto {
    @ApiProperty({ example: "Genre name in Turkmen", description: "Name of the Genre in Turkmen language" })
    @IsString()
    nameTk: string;

    @ApiProperty({ example: "Genre name in English", description: "Name of the Genre in English language" })
    @IsString()
    @IsOptional()
    nameEn: string;

    @ApiProperty({ example: "Genre name in Russian", description: "Name of the Genre in Russian language" })
    @IsString()
    @IsOptional()
    nameRu: string;


    @ApiProperty({ type: 'number', required: true })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    fileId: number;
}
