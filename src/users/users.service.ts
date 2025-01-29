import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly UserRepository: UserRepository) {}
  private async hashedPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
  async create(createUserInput: CreateUserInput) {
    return this.UserRepository.create({
      ...createUserInput,
      password: await this.hashedPassword(createUserInput.password),
    });
  }

  async findAll() {
    return this.UserRepository.find({});
  }

  async findOne(_id: string) {
    return this.UserRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    return this.UserRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
          password:await  this.hashedPassword(updateUserInput.password),
        },
      },
    );
  }

  async remove(_id: string) {
    return this.UserRepository.findOneAndDelete({ _id });
  }
}
