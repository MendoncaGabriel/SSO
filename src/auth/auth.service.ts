import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { EnvService } from '../env/env.service';
import { LoginDTO } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAd } from './@types/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly db: PrismaService,
    private readonly env: EnvService
  ) {}

  private async getRoles(userId: string, clientId: string): Promise<string[]> {
    const roles = await this.db.role.findMany({
      where: {
        permission: {
          clientId,
          users: { some: { userId } },
        },
      },
      select: { action: true, resource: true },
    });

    return roles.map(r => `${r.action}:${r.resource}`);
  }

  async login({ login, password, clientId }: LoginDTO) {
    const { API_AD, JWT_SECRET, PASSWORD_ADMIN } = this.env.getAll();

    // Login admin local
    if (login === 'admin') {
      if (password !== PASSWORD_ADMIN) {
        throw new UnauthorizedException('invalid login or password');
      }

      const userAdmin = await this.db.user.findFirst({ where: { firstName: 'admin' } });
      if (!userAdmin) throw new UnauthorizedException('Admin user not found');

      const adminRoles = await this.getRoles(userAdmin.id, clientId);
      const token = jwt.sign({ roles: adminRoles }, JWT_SECRET, { expiresIn: '30d' });

      return { username: userAdmin.firstName, token, roles: adminRoles };
    }

    // Login via AD
    const { data } = await axios.post<UserAd | null>(API_AD, { username: login, password });

    const result = await this.userService.findByLogin(login);
    let user = result?.user ?? null;

    // Cria usuário se não existir
    if (!user && data) {
      user = (await this.userService.create(data)).user;
    }

    if (!user) {
      throw new UnauthorizedException('invalid login or password');
    }

    const userRoles = await this.getRoles(user.id, clientId);
    const token = jwt.sign({ roles: userRoles }, JWT_SECRET, { expiresIn: '1d' });

    return { username: user.firstName, token, roles: userRoles };
  }
}
