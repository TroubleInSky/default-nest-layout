import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength} from "class-validator";
import {UserEntity} from "../../../entities/user.entity";
import {Role} from "../../interfaces/user/role.enum";

export class UserResponseDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(128)
  @ApiProperty({ required: true })
  public email: string;

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

  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public role: Role;

}

@Injectable()
export class UserAutomapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap<UserEntity, UserResponseDTO>(
        mapper,
          UserEntity,
          UserResponseDTO,
        forMember(
          (dest) => dest.id,
          mapFrom((src) => src.id)
        ),
        forMember(
          (dest) => dest.email,
          mapFrom((src) => src.email)
        ),
        forMember(
          (dest) => dest.firstName,
          mapFrom((src) => src.firstName)
        ),
        forMember(
          (dest) => dest.lastName,
          mapFrom((src) => src.lastName)
        ),
          forMember(
              (dest) => dest.role,
              mapFrom((src) => src.role)
          ),
      );
    };
  }
}
