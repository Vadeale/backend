import { Request } from 'express';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
type AuthRequest = Request & {
    user: {
        id: string;
        login: string;
    };
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: AuthDto): Promise<{
        access_token: string;
        login: string;
    }>;
    login(body: AuthDto): Promise<{
        access_token: string;
        login: string;
    }>;
    me(request: AuthRequest): {
        id: string;
        login: string;
    };
}
export {};
