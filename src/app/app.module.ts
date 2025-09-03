import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from '../modules/login/login.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../lib/env.schema';
import { ClientModule } from '../modules/client/client.module';
import { UserModule } from 'src/modules/user/user.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserPermissionModule } from 'src/modules/user-permission/user-permission.module';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

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
    AppModule,
    ClientModule,
    LoginModule,
    PermissionModule,
    RoleModule,
    UserModule,
    UserPermissionModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
