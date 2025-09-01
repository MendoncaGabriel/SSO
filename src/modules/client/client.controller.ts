import { Controller, Get, Param, Post } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get("")
  async listClients(){
    return await this.clientService.list();
  }

  @Get(":id")
  async findById(@Param() id: string){
    return await this.clientService.getById({id});
  }


}
