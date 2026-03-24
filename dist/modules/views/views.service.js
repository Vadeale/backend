"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const file_storage_service_1 = require("../storage/file-storage.service");
let ViewsService = class ViewsService {
    constructor(storage) {
        this.storage = storage;
    }
    count(token, action, remoteIp) {
        const viewerId = (0, node_crypto_1.createHash)('md5').update(remoteIp).digest('hex');
        const jobs = this.storage.readJobs();
        let responses = 0;
        jobs.jobs = jobs.jobs.map((item) => {
            if (item.token !== token)
                return item;
            const responders = Array.isArray(item.responders) ? item.responders : [];
            const viewers = Array.isArray(item.viewers) ? item.viewers : [];
            if (action === 'respond' && !responders.includes(viewerId))
                responders.push(viewerId);
            if (action === 'view' && !viewers.includes(viewerId))
                viewers.push(viewerId);
            responses = responders.length;
            return { ...item, responders, viewers, responses, unique_views: viewers.length };
        });
        this.storage.saveJobs(jobs);
        return { success: true, responses };
    }
};
exports.ViewsService = ViewsService;
exports.ViewsService = ViewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_storage_service_1.FileStorageService])
], ViewsService);
//# sourceMappingURL=views.service.js.map