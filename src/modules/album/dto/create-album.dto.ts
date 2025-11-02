import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {

    @ApiProperty({ example: "Album name in Turkmen", description: "Name of the album in Turkmen language" })
    @IsString()
    nameTk: string;

    @ApiProperty({ example: "Album name in English", description: "Name of the album in English language" })
    @IsString()
    @IsOptional()
    nameEn: string;

    @ApiProperty({ example: "Album name in Russian", description: "Name of the album in Russian language" })
    @IsString()
    @IsOptional()
    nameRu: string;

}
