import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { db } from 'src/lib/prisma';

@Injectable()
export class UserService {
  constructor(private readonly config: ConfigService) {}
  
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
}
