import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dist/user/user.entity';
import { Repository } from 'typeorm';
import { UserAuthDto } from '../dto/userAuthDto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from '../dto/token.dto';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { UserRole } from '../../enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(HealthcareFacility)
    private readonly HealthcareFacilityRepository: Repository<HealthcareFacility>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    userType: string,
    email: string,
    password: string,
  ): Promise<Partial<User | HealthcareFacility> | UnauthorizedException> {
    if (userType === 'user') {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...userWithNoPassword } = user;
        return userWithNoPassword;
      } else {
        return new UnauthorizedException('Invalid Credentials');
      }
    } else {
      const hospital = await this.HealthcareFacilityRepository.findOne({
        where: { email },
      });
      if (hospital && (await bcrypt.compare(password, hospital.password))) {
        const { password, ...hospitalWithNoPassword } = hospital;
        return hospitalWithNoPassword;
      } else {
        return new UnauthorizedException('Invalid Credentials');
      }
    }
  }

  async login(
    entity: User | HealthcareFacility,
    userType: string,
  ): Promise<{
    user: Partial<User | HealthcareFacility>;
    access_token: string;
    refresh_token: string;
  }> {
    const payload = {
      email: entity.email,
      role: entity.role,
      sub: { id: entity.id },
      userType,
    };
    if (!entity?.id) {
      throw new UnauthorizedException('Invalid user data');
    }

    const { password, ...entityWithoutPassword } = entity;

    return {
      user: entityWithoutPassword,
      access_token: this.jwtService.sign(payload, {
        secret: process.env.TOKEN_SECRET,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '2d',
        secret: process.env.TOKEN_SECRET,
      }),
    };
  }

  async register(createUserDto: UserAuthDto): Promise<User> {
    try {
      const userObject = {
        ...createUserDto,
        role: UserRole.ADMIN,
      }
      const user = await this.userRepository.create(userObject);
      user.password = await bcrypt.hash(user.password, 10);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async checkAuth(
    token: TokenDTO,
  ): Promise<{ valid: boolean; user?: Partial<User> }> {
    try {
      const decoded = this.jwtService.verify(token.token);
      if (!decoded) throw 'Invalid token';
      const user =
        decoded?.role === UserRole?.HOSPITAL
          ? await this.HealthcareFacilityRepository.findOne({
              where: { id: decoded?.sub?.id },
            })
          : await this.userRepository.findOne({
              where: { id: decoded?.sub?.id },
            });

      return { valid: true, user };
    } catch (error) {
      return { valid: false };
    }
  }

  async refreshTokens(user: User) {
    const payload = { email: user.email, sub: { id: user.id } };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
