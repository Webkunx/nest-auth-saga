import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userModel: ReturnModelType<typeof User> ,
    private jwtService: JwtService){}

    async createUser(user: User): Promise<User>{
        const createdUser = new this.userModel(user)
        return await createdUser.save()
        // return user
    }

    async getAllUsers(): Promise<User[]>{
        return this.userModel.find().exec()
    }
    async validateUserPassword(user: User){
        const {email, password} = user
        const found: User = await this.userModel.findOne({email}).exec()

        if(found && (await found.copmareHashedPasswords(password))){
            return email
        }
        return null
    }

    async signUp(user: User): Promise<string>{
        const found:User = await this.userModel.findOne({email: user.email}).exec()
        console.log(found);
        
        if(found){
            throw new ConflictException('user with this email already exists')
        }

        user.salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, user.salt)
        const newUser = new this.userModel(user)
        await newUser.save()
        return newUser.email
    }

    async signIn(user: User){
        const email = await this.validateUserPassword(user)
        if(!email){
            throw new UnauthorizedException('Invalid Credentials')
        }

        const payload: JwtPayload = {email}
        const accessToken = this.jwtService.sign(payload)
        return {accessToken}
    }   
}

