import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post("login")
  login(
    @Body() body: LoginDTO
  ): Promise<{ username: string; token: string; roles: string[] }> {
    return this.authService.login(body);
  }

  
  @Get('verify')
  verifyToken(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return { valid: false, message: 'No token provided' };
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return { valid: false, message: 'Invalid token format' };
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET!,
      });
      return { valid: true, payload };
    } catch (e) {
      return { valid: false, message: 'Token expired or invalid' };
    }
  }
}
