import { ConflictException, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create.role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  
  @Post()
  async create(data: CreateRoleDTO){
    const {roles} = await this.roleService.listByPermissionId(data.permissionId);
    
    const existingRules = roles.filter(e => {
      e.action === data.action &&
      e.permissionId === data.action && 
      e.resource === data.action
    })

    if(existingRules.length !== 0){
      throw new ConflictException("This role already exists")
    }

    return await this.roleService.create(data);
  }
}
