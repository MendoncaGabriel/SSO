import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../login/dto/create.user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService
  ){}

  async findByLogin(login: string){
    const user = await this.db.user.findFirst({
      where: {
        employeeNum: login
      } 
    })

    return {user}
  }

  async delete(id: string){
    const user = await this.db.user.delete({
      where: {
        id
      }
    })

    return {user}
  }

  async create(data: CreateUserDTO){
    const user = await this.db.user.create({
      data
    })
    return {user}
  }
}
