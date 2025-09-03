import { IsString, IsUrl } from "class-validator";

export class CreateClientDTO {
  @IsString()
  name: string;

  @IsUrl()
  url: string;
}