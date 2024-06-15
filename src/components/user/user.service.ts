import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterRequestDTO } from '../../common/dto/user/register.request.dto';
import { UserRequestDTO } from '../../common/dto/user/user.request.dto';
import { Role } from '../../common/interfaces/user/role.enum';
import { ForbiddenException } from '../../common/exceptions/common/forbidden.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: RegisterRequestDTO): Promise<UserEntity> {
    const userParams = await this.mapper.mapAsync(
      dto,
      RegisterRequestDTO,
      UserEntity,
    );
    return await this.userRepo.save(userParams);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  async update(userId: number, dto: UserRequestDTO): Promise<UserEntity> {
    const redactor = await this.findById(userId);
    const entity = await this.findById(dto.id);
    if (redactor.role !== Role.ADMIN && redactor.id !== entity.id) {
      throw new ForbiddenException();
    }
    await this.userRepo.save(dto);
    return await this.findById(dto.id);
  }
}
