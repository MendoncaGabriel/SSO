import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserAd } from 'src/@types/user';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService
  ) {}

  async login(
    {login, password}:
    {login: string, password: string}
  ){
    const API_AD = this.config.get<string>("API_AD")!;
    const JWT_SECRET = this.config.get<string>("JWT_SECRET")!;
    
    const { data } = await axios.post<UserAd | null>(API_AD, {
      username: login,
      password
    });  

    if(data){ //Verificar no SSO se usuario exist, se não existir registra automaticamente mas sem permissions
      const {user} = await this.userService.findByLogin(login);
      if(!user) {
        await this.userService.create(data);
      }
    }

    // buscar aplicações que este usuario tem acesso
    // buscar roles para cada app que este usuario tem
    const payload = {roles: ["admin"]}

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    return { user: data, token }
  }
}
