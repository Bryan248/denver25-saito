import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { IndexController } from './controllers/index.controller';
import { KeeperController } from "./controllers/keeper.controller";
import { KeeperModule } from "@saito/keeper";

@Module({
  imports: [KeeperModule],
  controllers: [IndexController, KeeperController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
