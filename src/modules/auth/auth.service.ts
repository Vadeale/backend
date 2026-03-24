import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthUserPayload } from './types/auth-user-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(login: string, password: string): Promise<{ access_token: string; login: string }> {
    const normalizedLogin = login.trim().toLowerCase();
    const existing = await this.usersService.findByLogin(normalizedLogin);
    if (existing) {
      throw new ConflictException('Login already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(normalizedLogin, passwordHash);
    return {
      access_token: await this.signToken({ sub: user.id, login: user.login }),
      login: user.login,
    };
  }

  async login(login: string, password: string): Promise<{ access_token: string; login: string }> {
    const normalizedLogin = login.trim().toLowerCase();
    const user = await this.usersService.findByLogin(normalizedLogin);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: await this.signToken({ sub: user.id, login: user.login }),
      login: user.login,
    };
  }

  me(user: { id: string; login: string }): { id: string; login: string } {
    return { id: user.id, login: user.login };
  }

  private signToken(payload: AuthUserPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
