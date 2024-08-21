import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login (@Req() req) {
    const user = req.user
    console.log(user)
    return await this.authService.login(user)
  }

  @Post('/refresh-token')
  async refreshToken() {}

  @Post('/logout')
  async logout() {}

  @Get('/protected')
  async protected() {}
}
