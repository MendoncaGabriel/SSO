import { IsString, IsUUID } from "class-validator";

export class CreatePermissionDTO {
  @IsString()
  name: string;

  @IsUUID()
  clientId: string;
}