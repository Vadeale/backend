import { FileStorageService } from '../storage/file-storage.service';
export declare class ViewsService {
    private readonly storage;
    constructor(storage: FileStorageService);
    count(token: string, action: 'view' | 'respond', remoteIp: string): {
        success: boolean;
        responses: number;
    };
}
