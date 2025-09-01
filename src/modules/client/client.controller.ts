import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/create.client';
import { UpdateClientDTO } from './dto/update.client';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Post()
  async create(@Body() body:CreateClientDTO){
    return await this.clientService.create(body);
  }

  @Get("")
  async list(){
    return await this.clientService.list();
  }

  @Get(":id")
  async getById(@Param() id: string){
    return await this.clientService.getById({id});
  }

  @Patch(":id")
  async update(
    @Param() {id}, 
    @Body() body: UpdateClientDTO
  ){
    return await this.clientService.update({
      id,
      name: body.name,
      url: body.url
    })
  }

  @Delete()
  async delete(@Param() {id}){
    return await this.clientService.delete(id);
  }
}
