import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from 'src/auth/dto/create.user.dto';

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

  async create(body:{login: string, password: string}){
    
    const user = await this.db.user.create({
      data: {
        
      }
    })
    return {user}
  }

  async listUsersByClientId(clientId: string){
    const _users = await  this.db.user.findMany({
      where: {
        permissions: {
          some: {
            permission: {
              clientId
            }
          }
        }
      }
    });

    const users = _users.filter(e => e.firstName !== "" && e.email !== "");
    return users
  }
}
