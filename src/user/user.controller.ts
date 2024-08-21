import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Public()
  @Post('/register-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Public()
  @Post('/forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.userService.requestPasswordRequest(email)
  }

  @Public()
  @Post('/reset-password/:token')
  passwordReset(@Param('token') token: string, @Body('newPassword') newPassword: string) {
    return this.userService.passwordReset(token, newPassword)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @Get('/all')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
