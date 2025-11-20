import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parkir.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { jenisKendaraan } from '@prisma/client';

export class UpdateParkirDto extends PartialType(CreateParkirDto) {
    @IsOptional()
    @IsNumber()
    durasi: number;
}
