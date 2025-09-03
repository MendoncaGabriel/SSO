import { IsString, IsUUID } from "class-validator";

export class CreateRoleDTO {
  @IsString()
  action: string;
  
  @IsString()
  resource: string;

  @IsUUID()
  permissionId: string;
}