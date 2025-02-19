import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(params => params.value?.toLowerCase())
  readonly email: string;

  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
