import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { UserAd } from 'src/@types/user';
import { LoginDTO } from './dto/login.dto';

@Controller('auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() body: LoginDTO): Promise<{ user: UserAd | null, token: string }> {
    return this.loginService.login(body);
  }
}
