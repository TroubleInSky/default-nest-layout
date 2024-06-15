import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntity } from '../../../entities/user.entity';
import { Role } from '../../interfaces/user/role.enum';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { createModelIdentifierByType } from '../../utils/automapper.utils';

export class UserRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(128)
  @ApiProperty({ required: false })
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty({ required: false })
  public firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty({ required: true })
  public lastName: string;

  @IsOptional()
  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public role: Role;
}

@Injectable()
export class UserAutomapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap<UserRequestDTO, QueryDeepPartialEntity<UserEntity>>(
        mapper,
        UserRequestDTO,
        createModelIdentifierByType<QueryDeepPartialEntity<UserEntity>>(),
        forMember(
          (dest) => dest.id,
          mapFrom((src) => src.id || undefined),
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
