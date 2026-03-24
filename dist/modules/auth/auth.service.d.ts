import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(login: string, password: string): Promise<{
        access_token: string;
        login: string;
    }>;
    login(login: string, password: string): Promise<{
        access_token: string;
        login: string;
    }>;
    me(user: {
        id: string;
        login: string;
    }): {
        id: string;
        login: string;
    };
    private signToken;
}
