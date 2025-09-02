import { Controller } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';

@Controller('user-permission')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}
}
