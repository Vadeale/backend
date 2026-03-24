"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const jobs_module_1 = require("./jobs/jobs.module");
const payments_module_1 = require("./payments/payments.module");
const stats_module_1 = require("./stats/stats.module");
const user_entity_1 = require("./users/user.entity");
const views_module_1 = require("./views/views.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST ?? 'localhost',
                port: Number(process.env.DB_PORT ?? 5432),
                username: process.env.DB_USER ?? 'postgres',
                password: process.env.DB_PASSWORD ?? 'postgres',
                database: process.env.DB_NAME ?? 'app_db',
                entities: [user_entity_1.User],
                synchronize: (process.env.DB_SYNCHRONIZE ?? 'true') === 'true',
            }),
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            payments_module_1.PaymentsModule,
            stats_module_1.StatsModule,
            views_module_1.ViewsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map