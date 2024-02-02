import { MinLength, MaxLength, IsString, Matches } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password는 영어 또는 숫자만 허용됩니다.',
  })
  password: string;
}
