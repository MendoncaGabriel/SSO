import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)

  @Get()
  async listUsers(){
    return this.userService.listUsers();
  }
  
  @Role('read:user')
  @Get(":login")
  async findByLogin(@Param() {login}: {login: string}){
    return await this.userService.findByLogin(login);
  }

  @Role('create:user')
  @Post()
  async createUser(@Body() body:{login: string}){
    return await this.userService.create(body.login);
  }

  @Role('delete:user')
  @Delete(":userId")
  async deleteUser(@Param() {userId}: {userId: string}){
    return await this.userService.delete(userId);
  }
}
