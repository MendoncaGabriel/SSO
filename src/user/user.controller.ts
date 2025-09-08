import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { CreateUserDTO } from 'src/auth/dto/create.user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)

  @Get(":clientId")
  async listUsersByClientId(@Param() {clientId}: {clientId: string}){
    return this.userService.listUsersByClientId(clientId);
  }
  
  @Role('read:user')
  @Get(":login")
  async findByLogin(@Param() {login}: {login: string}){
    return await this.userService.findByLogin(login)
  }

  @Role('create:user')
  @Post()
  async createUser(@Body() body:{login: string, password: string}){
    return await this.userService.create(body)
  }
}
