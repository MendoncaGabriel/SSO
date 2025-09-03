import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  
  @Role('read:user')
  @Get(":login")
  async findByLogin(@Param() {login}: {login: string}){
    return await this.userService.findByLogin(login)
  }
}
