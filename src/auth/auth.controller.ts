import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
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

    
  @Post('verify')
  @HttpCode(200)
  verifyToken(@Req() req: Request, @Body() { roles }: { roles: string[] }) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET!,
      });

      // Verifica se todas as roles do body estão no payload.roles
      const tokenRoles: string[] = payload.roles || [];
      const allRolesValid = roles.every(role => tokenRoles.includes(role));

      if (!allRolesValid) {
        throw new UnauthorizedException('User not authorized for all required roles');
      }

      return { message: 'authenticated and authorized user' };
    } catch (e) {
      // token expirado ou inválido
      throw new UnauthorizedException('Token expired or invalid');
    }
  }


}
