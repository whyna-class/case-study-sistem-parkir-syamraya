import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { jenisKendaraan } from '@prisma/client';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { FindParkirDto } from './dto/find-parkir.dto';
import { Parkir } from './entities/parkir.entity';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}

  hitungTotal(jenis: string, durasi: number): number {
    const tarif ={
      RODA2: { pertama: 3000, berikut: 2000},
      RODA4: { pertama: 6000, berikut: 3000},
    };
    if (durasi === 1 ) return tarif[jenis].pertama;
    return tarif[jenis].pertama + (durasi - 1) * tarif[jenis].berikut;
  }

  async create(createParkirDto: CreateParkirDto) {
    try {
      const { platNomor, jenisKendaraan, durasi } = createParkirDto;

      const total = this.hitungTotal(jenisKendaraan, durasi);

      const data = await this.prisma.parkir.create({
        data: {
          platNomor,
          jenisKendaraan,
          durasi,
          total,
        },
      });

      return {
        success: true,
        message: 'Parkir berhasil ditambahkan',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(findParkirDto: FindParkirDto) {
    try {
      const { search = "", jenisKendaraan, page = 1, limit = 10, startDate, endDate } = findParkirDto;
      const skip = ( page - 1) * limit;

      const where: any = {};
      if(search){
        where.platNomor = {
          contains: search,
        };
      }

      if (jenisKendaraan) {
        where.jenisKendaraan = jenisKendaraan;
      }

      if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.createdAt.gte = start;
      }

      if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
      }
    }


      const parkir = await this.prisma.parkir.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      });
      const total = await this.prisma.parkir.count({ where });

      return {
        success: true,
        message: 'users data found successfully',
        data: parkir,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `error when get users: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.parkir.findUnique({
        where: { id },
      });

      if (!data) {
        return { 
          success: false, 
          message: 'Data parkir tidak ditemukan', 
          data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message };
    }
  }

  async total() {
    const allData = await this.prisma.parkir.findMany();
    const totalPendapatan = allData.reduce((sum, item) => sum + item.total, 0);
    return {
      success: true,
      totalPendapatan,
    };
  }

  async update(id: number, updateParkirDto: UpdateParkirDto) {
    try {
      const { durasi } = updateParkirDto;
      const findDurasi = await this.prisma.parkir.findFirst({ where: { id: id } })
      if (!findDurasi) {
        return {
          success: false,
          message: 'Parking data does not exist',
          data: null,
        }
      }
      const updateParkir = await this.prisma.parkir.update({
        where: { id: id },
        data: {
          id: id,
          platNomor: updateParkirDto.platNomor ?? findDurasi.platNomor,
          jenisKendaraan: updateParkirDto.jenisKendaraan ?? findDurasi.jenisKendaraan,
          durasi: durasi ?? findDurasi.durasi,
          total: durasi ? this.hitungTotal(findDurasi.jenisKendaraan, durasi) : findDurasi.total,
          
        }
      })
      return {
        success: true,
        message: 'Parking data updated successfully',
        data: updateParkir,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      };
    }
  }

    async remove(id: number) {
    try {
      const findParkir = await this.prisma.parkir.findFirst({ where: { id: id } })
      if (!findParkir) {
        return {
          success: false,
          message: 'Parking data does not exist',
          data: null,
        }
      }
      const deleteParkir = await this.prisma.parkir.delete({ where: { id: id } })
      return {
        success: true,
        message: 'Parking data deleted successfully',
        data: deleteParkir,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      };
    }
  }
}
