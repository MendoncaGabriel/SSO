import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from '../modules/login/login.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../lib/env.schema';
import { ClientModule } from '../modules/client/client.module';

@Module({
  imports: [
    LoginModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsed = envSchema.safeParse(env);
        if (!parsed.success) {
          console.error('Erro de variáveis de ambiente:', parsed.error.flatten().fieldErrors);
          throw new Error('Variáveis de ambiente inválidas');
        }
        return parsed.data;
      },
    }),
    AppModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
