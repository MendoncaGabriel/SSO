import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDTO } from "./create.client";

export class UpdateClientDTO extends PartialType(CreateClientDTO) {}