import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdService } from 'src/AD/ad.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AdService],
  exports: [UserService],
})
export class UserModule {}
