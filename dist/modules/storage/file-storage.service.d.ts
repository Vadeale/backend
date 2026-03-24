type JobsEnvelope = {
    jobs: Record<string, unknown>[];
};
export declare class FileStorageService {
    private readonly root;
    private readonly jobsPath;
    private readonly viewsPath;
    private readonly uploadsPath;
    readJobs(): JobsEnvelope;
    saveJobs(payload: JobsEnvelope): void;
    readViews(): Record<string, number>;
    saveViews(payload: Record<string, number>): void;
    ensureUploadsDir(): string;
}
export {};
