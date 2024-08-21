import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';
import * as generator from 'generate-password';
import { EmailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';
import { PasswordReset } from './entities/password.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private emailService: EmailService
  ) { }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, confirmPassword } = createUserDto

    if (password != confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const existingUser = await this.userRepository.findOne({ where: { email } })

    if (existingUser) {
      throw new ConflictException('User has been registered')
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    try {
      const savedUser = await this.userRepository.save(newUser);
  
      await this.emailService.sendMail(newUser.email, 'Registration successful', 'You have successfully registered');
  
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error occured while saving user');
    }
  }

  async createAdmin(createUserDto: CreateUserDto) {
    let { email, password } = createUserDto

    password = this.generateRandomToken(10)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const existingUser = await this.userRepository.findOne({ where: { email } })

    if (existingUser) {
      throw new ConflictException('User has been registered')
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: Role.admin
    });

    return await this.userRepository.save(newUser);
  }

  async findUserByRefreshToken(email: string, refreshToken: string): Promise<User> {
    const user = await this.findOneByEmail(email)
    const verifyToken = await bcrypt.compare(refreshToken, user.refreshToken)

    if (!verifyToken) {
      throw new UnauthorizedException('RefreshTokem not valid')
    }

    return user
  }

  async saveRefreshToken(email: string, refreshToken: string): Promise<User> {
    const user = await this.findOneByEmail(email)

    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt)

    user.refreshToken = hashedRefreshToken
    return await this.userRepository.save(user)
  }

  async removeRefreshToken(email: string): Promise<User> {
    const user = await this.findOneByEmail(email)

    user.refreshToken = null
    return await this.userRepository.save(user)
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    return user
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    return user;
  }

  async savePasswordResetToken(email: string, token: string) {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const user = await this.findOneByEmail(email)

    if(user.passwordReset) {
      await this.passwordResetRepository.remove(user.passwordReset);
    }

    const passwordReset = new PasswordReset();
    passwordReset.user = user;
    passwordReset.token = token;
    passwordReset.expiredAt = expirationTime;

    return await this.passwordResetRepository.save(passwordReset);
  }

  async requestPasswordRequest(email: string): Promise<any> {
    const token = this.generateRandomToken(48)

    try {
      await this.sendPasswordResetEmail(email, token);
      
      await this.savePasswordResetToken(email, token);
      
      return 'Email successfully sent';
    } catch (error) {
      console.error('Error sending email or saving token:', error.message);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const user = await this.findOneByEmail(email)

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
    console.log(resetUrl)
    await this.emailService.sendMail(user.email, 'Password Reset', 'Click the link below to reset your password', `<a href=${resetUrl}>Reset link</a>`)
  }

  async verifyToken(token: string): Promise<PasswordReset> {
    const passwordReset = await this.passwordResetRepository.findOne({ where: { token }, relations: ['user'] })

    if (!passwordReset) {
      throw new BadRequestException('Token is not valid')
    }

    const currentTime = new Date();
    if (currentTime > passwordReset.expiredAt) {
      throw new BadRequestException('Token is not valid')
    }

    return passwordReset
  }

  async passwordReset(token: string, newPassword: string) {
    const passwordReset = await this.verifyToken(token)

    const user = passwordReset.user;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await this.userRepository.save(user);
    await this.passwordResetRepository.remove(passwordReset);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.findOneById(id);

    const isPasswordSame = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordSame) {
      throw new BadRequestException('Passwords do not match');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await this.userRepository.save(user);

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private generateRandomToken(length: number): string {
    const password = generator.generate({
      length: length,
      numbers: true,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: true,
    });
    console.log("password=", password)
    return password
  }
}
