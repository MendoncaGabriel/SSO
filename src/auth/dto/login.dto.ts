import { IsString, Length, IsUUID } from "class-validator";

export class LoginDTO {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsUUID()
  clientId: string;
}
