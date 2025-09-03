import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserAd } from 'src/login/@types/user';
import jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { EnvService } from '../env/env.service';
import { LoginDTO } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly db: PrismaService,
    private env: EnvService
  ) {}

  async login(
    {login, password, clientId}: LoginDTO
  ){
    const { API_AD, JWT_SECRET } = this.env.getAll();
    
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
