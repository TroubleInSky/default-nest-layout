import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { RegisterRequestDTO } from '../../common/dto/user/register.request.dto';
import { confirmPassword } from '../../common/utils/crypt.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.usersService.findByEmail(email);
    const confirmPass = await confirmPassword(password, user?.password);
    if (!confirmPass) {
      throw new UnauthorizedException();
    }

    const payload: IJwtPayload = { id: user.id, email: user.email };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async signUp(dto: RegisterRequestDTO): Promise<boolean> {
    // const user = await this.usersService.findByEmail(dto.email);
    const createdUser = await this.usersService.create(dto);
    return !!createdUser;
  }
}
