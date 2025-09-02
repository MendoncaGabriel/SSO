import { Type } from "class-transformer";
import { IsInt, Min, Max, IsString, Length } from "class-validator";

export class LoginDTO {
  @IsString()
  @Length(7, 7)
  login: string;

  @IsString()
  @Length(6, 32, { message: "A senha deve ter entre 6 e 32 caracteres" })
  password: string;
}
