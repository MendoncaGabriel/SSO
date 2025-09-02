import { ConflictException, Controller, NotFoundException, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create.permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(data: CreatePermissionDTO){
    const { permissions } = await this.permissionService.listByClientId(data.clientId);
    if(!permissions ||  permissions.length === 0){
      throw new NotFoundException("Permission not found")
    }

    const exists = permissions.some(
      (e) => e.clientId === data.clientId && e.name === data.name,
    );

    if (exists) {
      throw new ConflictException('Permission already exists');
    }

    return await this.permissionService.create(data);
  }
}
