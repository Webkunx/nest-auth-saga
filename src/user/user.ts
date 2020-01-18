import { prop } from "@typegoose/typegoose";
import { Length } from "class-validator";
import * as bcrypt from "bcrypt";

export class User {
  @Length(5)
  @prop({ required: false })
  email: string;

  @Length(5)
  @prop({ required: true })
  password: string;

  @prop({ required: false })
  salt?: string;

  async copmareHashedPasswords(password): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
