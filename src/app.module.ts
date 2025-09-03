import { Module } from "@nestjs/common";
import { EnvModule } from "./env/env.module";
import { ClientModule } from "./client/client.module";
import { LoginModule } from "./login/login.module";
import { UserPermissionModule } from "./user-permission/user-permission.module";
import { RoleModule } from "./role/role.module";
import { PermissionModule } from "./permission/permission.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    EnvModule,
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
