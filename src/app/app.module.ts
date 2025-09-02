import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from '../modules/login/login.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../lib/env.schema';
import { ClientModule } from '../modules/client/client.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
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
    LoginModule,
    AppModule,
    ClientModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
