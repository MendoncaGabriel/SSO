import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import axios from 'axios';
import { AxiosError } from "axios";
import { UserAd } from "src/auth/@types/user";
import { EnvService } from "src/env/env.service";

@Injectable()
export class AdService {
  constructor(
    private readonly env: EnvService
  ) { }

  async ValidateAuthentication(
    user:
      { login: string, password: string }
  ): Promise<UserAd | null> {
    const { API_AD } = this.env.getAll();
    const requestBody = {
      userName: user.login,
      password: user.password
    }

    try {
      const { data } = await axios.post<UserAd | null>(API_AD, requestBody);
      if (!data) return null
      return data

    } catch (error) {
      console.log(error)
      return null
    }
  }


  async GetUserProperties(login: string) {
    const url = "http://brmanm1appc1/AD.Api.Americas.Man/api/Users/GetUserProperties";
    try {
      const { data } = await axios.post(
        url,
        JSON.stringify(login), // força enviar "4145596"
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      return data;
    } catch (error) {

      if (error instanceof AxiosError) {
        console.error("Erro:", error.response?.status, error.response?.data);
        throw new NotFoundException("User not found in AD")
      }
    }
  }


}