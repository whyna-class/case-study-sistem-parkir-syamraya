import { IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from 'class-validator';
import { jenisKendaraan } from '@prisma/client';
 

export class CreateParkirDto {
    @IsNotEmpty()
    @IsString()
    platNomor: string;

    @IsNotEmpty()
    @IsNumber()
    durasi: number;

    @IsNotEmpty()
    @IsString()
    jenisKendaraan: jenisKendaraan;
}