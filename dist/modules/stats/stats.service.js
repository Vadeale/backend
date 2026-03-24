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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const jobs_service_1 = require("../jobs/jobs.service");
let StatsService = class StatsService {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    activeJobs() {
        return this.jobsService.activeCount();
    }
    visitorsToday() {
        const min = 100;
        const max = 300;
        const progress = (new Date().getHours() * 3600 + new Date().getMinutes() * 60) / (24 * 3600);
        return Math.round(min + (max - min) * progress);
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], StatsService);
//# sourceMappingURL=stats.service.js.map