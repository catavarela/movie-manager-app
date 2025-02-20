import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(params => params.value?.toLowerCase())
  @ApiProperty({ example: "fake_email@gmail.com" })
  readonly email: string;

  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Min length 6 max length 20", example: "mysafepassword" })
  readonly password: string;
}
