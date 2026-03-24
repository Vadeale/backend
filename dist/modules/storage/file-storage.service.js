"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
let FileStorageService = class FileStorageService {
    constructor() {
        this.root = process.env.STORAGE_ROOT ?? (0, node_path_1.join)(process.cwd(), '..');
        this.jobsPath = (0, node_path_1.join)(this.root, 'jobs.json');
        this.viewsPath = (0, node_path_1.join)(this.root, 'views.json');
        this.uploadsPath = (0, node_path_1.join)(this.root, 'Uploads');
    }
    readJobs() {
        if (!(0, node_fs_1.existsSync)(this.jobsPath)) {
            return { jobs: [] };
        }
        const parsed = JSON.parse((0, node_fs_1.readFileSync)(this.jobsPath, 'utf-8'));
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.jobs)) {
            return parsed;
        }
        if (Array.isArray(parsed)) {
            return { jobs: parsed };
        }
        return { jobs: [] };
    }
    saveJobs(payload) {
        (0, node_fs_1.writeFileSync)(this.jobsPath, JSON.stringify(payload, null, 2), { encoding: 'utf-8' });
    }
    readViews() {
        if (!(0, node_fs_1.existsSync)(this.viewsPath)) {
            return {};
        }
        return JSON.parse((0, node_fs_1.readFileSync)(this.viewsPath, 'utf-8'));
    }
    saveViews(payload) {
        (0, node_fs_1.writeFileSync)(this.viewsPath, JSON.stringify(payload, null, 2), { encoding: 'utf-8' });
    }
    ensureUploadsDir() {
        if (!(0, node_fs_1.existsSync)(this.uploadsPath)) {
            (0, node_fs_1.mkdirSync)(this.uploadsPath, { recursive: true });
        }
        return this.uploadsPath;
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = __decorate([
    (0, common_1.Injectable)()
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map