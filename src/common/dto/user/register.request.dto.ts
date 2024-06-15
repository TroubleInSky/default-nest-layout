import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { UserEntity } from '../../../entities/user.entity';
import { cryptPasswordSync } from '../../utils/crypt.util';
import { Transform } from 'class-transformer';

export class RegisterRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => String(value).toLowerCase(), {
    toClassOnly: true,
  })
  @ApiProperty({ required: true })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ required: true })
  public password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty({ required: true })
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty({ required: true })
  public lastName: string;
}

@Injectable()
export class RegisterAutomapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap<RegisterRequestDTO, UserEntity>(
        mapper,
        RegisterRequestDTO,
        UserEntity,
        forMember(
          (dest) => dest.email,
          mapFrom((src) => src.email),
        ),
        forMember(
          (dest) => dest.password,
          mapFrom((src) => cryptPasswordSync(src.password)),
        ),
        forMember(
          (dest) => dest.firstName,
          mapFrom((src) => src.firstName),
        ),
        forMember(
          (dest) => dest.lastName,
          mapFrom((src) => src.lastName),
        ),
      );
    };
  }
}
