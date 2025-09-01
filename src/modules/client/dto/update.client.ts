import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDTO } from "./create.client";
import { IsUUID } from "class-validator";

export class UpdateClientDTO extends PartialType(CreateClientDTO) {
  @IsUUID()
  id: string;
}