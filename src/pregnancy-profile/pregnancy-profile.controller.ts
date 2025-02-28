import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PregnancyProfileService } from './pregnancy-profile.service';
import { CreatePregnancyProfileDto } from './dto/create-pregnancy-profile.dto';
import { UpdatePregnancyProfileDto } from './dto/update-pregnancy-profile.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth-guard';
import { CurrentLoginUser } from 'src/authentication/decorator/get-loginUser';
import { LoginUser } from 'src/user/types/loginUserInterface';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/pregnancy-profile')
export class PregnancyProfileController {
  constructor(
    private readonly pregnancyProfileService: PregnancyProfileService,
  ) {}

  @Post()
  create(
    @CurrentLoginUser() user: LoginUser,
    @Body() createPregnancyProfileDto: CreatePregnancyProfileDto,
  ) {
    return this.pregnancyProfileService.create(user, createPregnancyProfileDto);
  }

  @Get()
  findAll() {
    return this.pregnancyProfileService.findAll();
  }

  @Get(':id')
  findOne(@CurrentLoginUser() user:LoginUser, @Param('id') id: number) {
    return this.pregnancyProfileService.findOne(user,id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePregnancyProfileDto: UpdatePregnancyProfileDto,
  ) {
    return this.pregnancyProfileService.update(+id, updatePregnancyProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pregnancyProfileService.remove(+id);
  }
}
