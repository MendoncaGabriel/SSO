import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/prisma';
import { CreateUserDTO } from '../login/dto/create.user.dto';

@Injectable()
export class UserService {
  async findByLogin(login: string){
    const user = await db.user.findFirst({
      where: {
        employeeNum: login
      } 
    })

    return {user}
  }

  async delete(id: string){
    const user = await db.user.delete({
      where: {
        id
      }
    })

    return {user}
  }

  async create(data: CreateUserDTO){
    const user = await db.user.create({
      data
    })
    return {user}
  }
}
