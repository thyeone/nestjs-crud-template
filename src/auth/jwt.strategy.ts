import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JWT_SECRET_KEY } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
