import { Controller, Get, Post, Param, Patch, Body, Delete, UseGuards } from '@nestjs/common';
import { CreateClientDTO } from './dto/create.client';
import { UpdateClientDTO } from './dto/update.client';
import { FindClientByIdDTO } from './dto/findById.client';
import { DeleteClientByIdDTO } from './dto/deleteclient';
import { ClientService } from './client.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller('client')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class ClientController {
  constructor(
    private readonly clientService: ClientService
  ){}

  @Role('write:client')
  @Post()
  async create(@Body() data: CreateClientDTO) {
    return await this.clientService.create(data);
  }

  @Role('read:client')
  @Get()
  async list() {
    return await this.clientService.list();
  }
  
  @Role('read:client')
  @Get(":id")
  async findById(@Param() {id}: {id: string}) {
    return await this.clientService.findById(id);
  }
  
  @Role('update:client')
  @Patch(":id")
  async update(
    @Param() { id }: FindClientByIdDTO, 
    @Body() data: UpdateClientDTO
  ) {
    return this.clientService.update(id, data)
  }
  
  @Role('delete:client')
  @Delete(":id")
  async delete(@Param() { id }: DeleteClientByIdDTO) {
    return await this.clientService.delete(id)
  }
}
