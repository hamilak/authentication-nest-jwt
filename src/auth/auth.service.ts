import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_EXPIRY
    })

    await this.userService.saveRefreshToken(user.email, refreshToken)

    return {
      accessToken, refreshToken
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    console.log(email)
    const user = await this.userService.findUserByEmail(email)

    if(!user) {
      throw new UnauthorizedException('Email not registered')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch) {
      throw new UnauthorizedException('Passwords do not match')
    }

    return user
  }

  async refreshToken(user: User, refreshToken: string) {
    const userWithRefreshToken = await this.userService.findUserByRefreshToken(user.email, refreshToken)

    const payload = {
      sub: userWithRefreshToken.id,
      email: userWithRefreshToken.email,
      role: userWithRefreshToken.role
    }

    const accessToken = this.jwtService.sign(payload)
    
    return accessToken
  }

  async logout(email: string) {
    return await this.userService.removeRefreshToken(email)
  }
}
