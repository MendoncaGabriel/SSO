import { IsUUID } from "class-validator";

export class FindClientByIdDTO {
  @IsUUID()
  id: string;
}