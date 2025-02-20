import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(params => params.value?.toLowerCase())
  @ApiProperty({ example: "fake_email@gmail.com" })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ description: "Min length 6 max length 20", example: "mysafepassword" })
  readonly password: string;
}
