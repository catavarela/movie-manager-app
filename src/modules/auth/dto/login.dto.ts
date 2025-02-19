import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(params => params.value?.toLowerCase())
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
