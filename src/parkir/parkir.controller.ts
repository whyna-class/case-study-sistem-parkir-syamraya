import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { FindParkirDto } from './dto/find-parkir.dto';

@Controller('parkir')
export class ParkirController {
  constructor(private readonly parkirService: ParkirService) {}

  @Post()
  create(@Body() createParkirDto: CreateParkirDto) {
    return this.parkirService.create(createParkirDto);
  }

  @Get()
  findAll(@Query() query: FindParkirDto){
    return this.parkirService.findAll(query);
  }


  @Get('total')
  totalPendapatan() {
    return this.parkirService.total();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkirService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkirDto: CreateParkirDto) {
    return this.parkirService.update(+id, updateParkirDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkirService.remove(+id);
  }

}
