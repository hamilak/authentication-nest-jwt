import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto/login.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private authService: AuthService
    ){
        super({
            usernameField: 'email',
        })
    }

    async validate(email: string, password: string): Promise<User> {
        console.log('local auth')
        const user = await this.authService.validateUser(email, password)
        if(!user) {
            throw new UnauthorizedException('Unauthorized')
        }
        return user
    }
}