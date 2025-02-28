import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PHealthRecordService } from './p-health-record.service';
import { CreatePHealthRecordDto } from './dto/create-p-health-record.dto';
import { UpdatePHealthRecordDto } from './dto/update-p-health-record.dto';

@Controller('api/v1/p-health-record')
export class PHealthRecordController {
  constructor(private readonly pHealthRecordService: PHealthRecordService) {}

  @Post(':id')
  create(
    @Body() createPHealthRecordDto: CreatePHealthRecordDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pHealthRecordService.create(createPHealthRecordDto, id);
  }

  @Get()
  findAll() {
    return this.pHealthRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pHealthRecordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePHealthRecordDto: UpdatePHealthRecordDto,
  ) {
    return this.pHealthRecordService.updateBasicHealthRecords(
      id,
      updatePHealthRecordDto,
    );
  }

  @Patch('all/:id')
  updateAll(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePHealthRecordDto: UpdatePHealthRecordDto,
  ) {
    return this.pHealthRecordService.updateAllHealthRecords(
      id,
      updatePHealthRecordDto,
    );
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pHealthRecordService.remove(+id);
  }
}
