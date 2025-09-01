import { Controller, Get, Post } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get("client")
  async list(){
    return await this.clientService.list();
  }


}
