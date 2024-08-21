import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Payload } from "../types/payload.type";
import { UserService } from "src/user/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: Payload) {
        console.log("jwt", payload)
        const user = await this.userService.findOneById(payload.sub)
        if (!user) {
            throw new UnauthorizedException('Invalid or expired token');
          }
        return user
    }
}