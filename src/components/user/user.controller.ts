import { Body, Controller, Req, RequestMethod } from '@nestjs/common';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { UserService } from './user.service';
import { UserResponseDTO } from '../../common/dto/user/user.response.dto';
import { ApiResponse } from '../../common/decorators/api-response.decorator';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserEntity } from '../../entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDTO } from '../../common/dto/user/user.request.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly userService: UserService,
  ) {}

  @SecureEndpoint('me', RequestMethod.GET)
  @ApiResponse(UserResponseDTO)
  async getMe(@Req() req: IAuthorizedRequest): Promise<UserResponseDTO> {
    const user = await this.userService.findById(req.user.id);
    return this.mapper.mapAsync(user, UserEntity, UserResponseDTO);
  }

  @SecureEndpoint('update', RequestMethod.POST)
  @ApiResponse(UserResponseDTO)
  async updateUser(
    @Req() req: IAuthorizedRequest,
    @Body() body: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.update(req.user.id, body);
    return this.mapper.mapAsync(user, UserEntity, UserResponseDTO);
  }
}
