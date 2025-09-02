import { IsUUID } from "class-validator";

export class CreateUserPermissionDTO {
  @IsUUID()
  userId: string;

  @IsUUID()
  permissionId: string
}