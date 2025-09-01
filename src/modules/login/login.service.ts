import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserAd } from 'src/@types/user';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginService {
  constructor(private readonly config: ConfigService) {}
  
  async login(
    {login, password}:
    {login: number, password: string}
  ){
    const API_AD = this.config.get<string>("API_AD")!;
    const JWT_SECRET = this.config.get<string>("JWT_SECRET")!;
    
    const { data } = await axios.post<UserAd | null>(API_AD, {
      username: login,
      password
    });  

    // buscar aplicações que este usuario tem acesso
    // buscar roles para cada app que este usuario tem
    const payload = {roles: ["admin"]}

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    return { user: data, token }
  }
}
