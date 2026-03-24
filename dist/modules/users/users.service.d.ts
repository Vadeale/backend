import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findByLogin(login: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(login: string, passwordHash: string): Promise<User>;
}
