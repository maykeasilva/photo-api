import { UsersRepository } from '@/domain/actors/application/repositories/users-repository'
import { User } from '@/domain/actors/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find((item) => item.username === username)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)
    this.items[itemIndex] = user
  }
}
