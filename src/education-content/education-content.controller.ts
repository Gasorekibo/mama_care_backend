import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EducationContentService } from './education-content.service';
import { CreateEducationContentDto } from './dto/create-education-content.dto';
import { UpdateEducationContentDto } from './dto/update-education-content.dto';
import { EducationModuleType } from 'src/enums/education-module-type.enum';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth-guard';
import { RoleGuard } from 'src/authorization/role/role.guard';
import { Role } from 'src/authorization/role/role.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { CurrentLoginUser } from 'src/authentication/decorator/get-loginUser';
import { User } from 'src/dist/user/user.entity';
import { LoginUser } from 'src/user/types/loginUserInterface';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/education-content')
export class EducationContentController {
  constructor(
    private readonly educationContentService: EducationContentService,
  ) {}
  @UseGuards(RoleGuard)
  @Role(
    UserRole.ADMIN,
    UserRole.COMMUNITY_HEALTH_WORKER,
    UserRole.PREGNANT_WOMAN,
  )
  @Post()
  create(
    @Body() createEducationContentDto: CreateEducationContentDto,
    @CurrentLoginUser() user: LoginUser,
  ) {
    return this.educationContentService.create(createEducationContentDto, user);
  }

  @Get()
  findAll(@Query('type') type: EducationModuleType) {
    return this.educationContentService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.educationContentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEducationContentDto: UpdateEducationContentDto,
  ) {
    return this.educationContentService.update(+id, updateEducationContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationContentService.remove(+id);
  }
}
