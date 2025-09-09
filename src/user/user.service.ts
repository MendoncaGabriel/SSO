import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from 'src/auth/dto/create.user.dto';
import { AdService } from 'src/AD/ad.service';

@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly ad: AdService
  ) { }

  async findByLogin(login: string) {
    const user = await this.db.user.findFirst({
      where: {
        employeeNum: login
      }
    })

    return { user }
  }

  async delete(id: string) {
    const user = await this.db.user.delete({
      where: {
        id
      }
    })

    return { user }
  }

  async create(login: string) {
    const userExists = await this.db.user.findFirst({
      where: {
        employeeNum: login
      }
    })
    if(userExists){
      throw new ConflictException("User has already been registered");
    }
    

    const userAd = await this.ad.GetUserProperties(login);

    if (userAd) {
      const user = await this.db.user.create({
        data: userAd
      })
      return { user }
    }
  }

  async listUsersByClientId(clientId: string) {
    const _users = await this.db.user.findMany({
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

  async listUsers() {
    const _users = await this.db.user.findMany();

    const users = _users.filter(e => e.firstName !== "" && e.email !== "");
    return users
  }
}
