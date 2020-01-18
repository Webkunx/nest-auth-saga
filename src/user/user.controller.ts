import { Controller, Post, Get, ValidationPipe, UsePipes, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @UsePipes(ValidationPipe)
    @Post()
    async createUser(@Body() user: User):Promise<User>{
        return this.userService.createUser(user)
    }

    @Get()
    async getAllUsers():Promise<User[]>{
        return this.userService.getAllUsers()
    }

    @UseGuards(AuthGuard())
    @Get('checkjwt')
    async checkJwt(){
        return true
    }
    
    @UsePipes(ValidationPipe)
    @Post('signup')
    async signUp(@Body() user: User){
        return this.userService.signUp(user)
    }

    @UsePipes(ValidationPipe)
    @Post('signin')
    async signIn(@Body() user: User){
        return this.userService.signIn(user)
    }
}
