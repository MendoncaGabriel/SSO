import { Type } from "class-transformer";
import { IsInt, Min, Max, IsString, Length } from "class-validator";

export class LoginDTO {
  @Type(() => Number)
  @IsInt({ message: "O login deve ser numérico" })
  @Min(1000000, { message: "O login deve ter exatamente 7 dígitos" })
  @Max(9999999, { message: "O login deve ter exatamente 7 dígitos" })
  login: number;

  @IsString()
  @Length(6, 32, { message: "A senha deve ter entre 6 e 32 caracteres" })
  password: string;
}

export class UserAdResponse {
  firstName: string;
  lastName: string;
  displayName: string;
  fullName: string;
  department: string;
  email: string;
  title: string;
  workCell: string | null;
  manager: string;
  employeeNum: string;
  costCenter: string;
  location: string;
  status: string;
  memberGroups: string | null;
}