import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, user: Partial<User>): Promise<void> {
    await this.userRepository.updateUser(id, user);
  }
}
