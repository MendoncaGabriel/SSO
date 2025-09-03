import { Injectable, OnModuleInit } from "@nestjs/common";
import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string(),
  API_AD: z.string(),
  DATABASE_URL: z.string(),
  PASSWORD_ADMIN: z.string(),
  LOGIN_ADMIN: z.string(),
  URI_API: z.string(),
});

export type Env = z.infer<typeof envSchema>;

@Injectable()
export class EnvService implements OnModuleInit {
  private _env: Env;

  onModuleInit() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error(
        "Erro de variáveis de ambiente:",
        parsed.error.flatten().fieldErrors
      );
      throw new Error("Variáveis de ambiente inválidas");
    }
    this._env = parsed.data;
  }

  // método para acessar variáveis de ambiente tipadas
  get<T extends keyof Env>(key: T): Env[T] {
    return this._env[key];
  }

  // opcional: retornar todas as variáveis
  getAll(): Env {
    return this._env;
  }
}
