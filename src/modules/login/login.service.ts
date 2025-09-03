import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserAd } from 'src/@types/user';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly db: PrismaService
  ) {}

  async login(
    {login, password, clientId}:
    {login: string, password: string, clientId: string}
  ){
    const API_AD = this.config.get<string>("API_AD")!;
    const JWT_SECRET = this.config.get<string>("JWT_SECRET")!;
    
    const { data } = await axios.post<UserAd | null>(API_AD, {
      username: login,
      password
    });  

    const {user} = await this.userService.findByLogin(login);
    const userRoles: string[] = []

    if(user){
      const roles = await this.db.role.findMany({
        where: {
          permission: {
            clientId,
            users: {
              some: {
                userId: user.id
              }
            }
          }
        },
        select: {
          action: true,
          resource: true,
        }
      })

      for(const role of roles){
        const keyRole = `${role.action}:${role.resource}`
        userRoles.push(keyRole)
      }

    } else if(!user && data) {
      await this.userService.create(data);
    }
  

    const payload = {roles: userRoles}

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    return { user, token, roles: userRoles }
  }
}
