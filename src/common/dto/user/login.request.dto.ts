import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(128)
  @ApiProperty({ required: true })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ required: true })
  public password: string;
}
