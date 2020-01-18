import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypegooseModule } from 'nestjs-typegoose'

@Module({
  imports: [UserModule, TypegooseModule.forRoot('mongodb+srv://admin:admin@cluster0-lrxwn.mongodb.net/test?retryWrites=true&w=majority')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
