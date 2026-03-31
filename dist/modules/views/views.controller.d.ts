import type { Request } from 'express';
import { ViewsService } from './views.service';
export declare class ViewsController {
    private readonly viewsService;
    constructor(viewsService: ViewsService);
    count(token: string, action: "view" | "respond" | undefined, request: Request): Promise<{
        success: boolean;
        responses: number;
    }>;
}
