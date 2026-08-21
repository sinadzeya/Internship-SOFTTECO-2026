import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    this.logger.debug('Fetching user by email');
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug('Start user creation process');
    const existingUser = await this.findOneByEmail(createUserDto.email);

    if (existingUser) {
      this.logger.warn(
        'Creation failed: User with provided email already exists',
      );
      throw new ConflictException('User with provided email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.debug(`User created successfully with id: ${savedUser.id}`);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.debug('Fetching all users from database');
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    this.logger.debug(`Fetching user with id: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      this.logger.warn(`Fetching failed: User with id ${id} does not exist`);
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<User> {
    this.logger.debug(`Updating user with id: ${id}`);

    if (id !== userId) {
      this.logger.warn(
        `Update forbidden: User ${userId} tried to edit user ${id}`,
      );
      throw new ForbiddenException('You can only edit your own information');
    }

    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findOneByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with provided email already exists');
      }
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    this.logger.debug(`User ${id} updated successfully`);

    return updatedUser;
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    this.logger.debug(`Updating refreshToken for user with id: ${id}`);
    await this.userRepository.update(id, {
      currentHashedRefreshToken: refreshToken,
    });
  }

  async remove(id: string, userId: string): Promise<User> {
    this.logger.debug(`Removing user with id: ${id}`);
    if (id !== userId) {
      this.logger.warn(
        `Delete forbidden: User ${userId} tried to delete user ${id}`,
      );
      throw new ForbiddenException('You can only delete your own information');
    }

    const user = await this.findOne(id);

    const removedUser = await this.userRepository.remove(user);
    this.logger.debug(`User ${id} removed successfully`);

    return removedUser;
  }
}
