import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authDto: AuthDto): Promise<void> {
    const { username, password } = authDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') throw new ConflictException('Existing username');
      else throw new InternalServerErrorException();
    }
  }

  async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
    const { username, password } = authDto;
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login falied');
    }
  }
}
