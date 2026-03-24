import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { AuthUserPayload } from './types/auth-user-payload.type';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: AuthUserPayload): Promise<{
        id: string;
        login: string;
    }>;
}
export {};
