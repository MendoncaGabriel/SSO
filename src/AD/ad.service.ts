import { Injectable } from "@nestjs/common";
import axios from 'axios';
import { UserAd } from "src/auth/@types/user";
import { EnvService } from "src/env/env.service";

@Injectable()
export class AdService {
  constructor(
    private readonly env: EnvService
  ){}
  async login(user: {login: string, passport: string}){
    const { API_AD } = this.env.getAll();
    const requestBody = {
      userName: user.login,
      password: user.passport
    }

    const { data } = await axios.post<UserAd | null>(API_AD, requestBody);
    return data    
  }
}