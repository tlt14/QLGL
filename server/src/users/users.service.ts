import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });
    return user;
  }
  async createUser({ username, password }: { username: string; password: string }) {
    try {
      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltOrRounds);

      return this.usersRepository.save({
        username: username,
        password: hashPassword,
      });
    } catch (error) {
      return {
        error: true,
        success: false,
      };
    }
  }

  findUser(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = updateUserDto.refreshToken;
    return this.usersRepository.save(user);
  }

  async findById(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
