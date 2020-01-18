import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { User } from "./user";
import { ReturnModelType } from "@typegoose/typegoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User) private userModel: ReturnModelType<typeof User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "saga"
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;
    const user: User = await this.userModel.find({ email }).exec();

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
