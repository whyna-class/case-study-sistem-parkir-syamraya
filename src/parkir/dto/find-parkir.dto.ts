import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { jenisKendaraan } from "@prisma/client";
import { Type } from "class-transformer";


export class FindParkirDto {
    @IsOptional()
    @IsString()
    search: String;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number;

    @IsOptional()
    @IsEnum(jenisKendaraan)
    jenisKendaraan: jenisKendaraan  ;

    @IsOptional()
    @IsString()
    startDate: string;

    @IsOptional()
    @IsString()
    endDate: string;

}