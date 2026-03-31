"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const express = require("express");
const node_path_1 = require("node:path");
const app_module_1 = require("./modules/app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.enableCors();
    const storageRoot = (0, node_path_1.resolve)(process.cwd(), process.env.STORAGE_ROOT ?? './storage');
    app.use('/storage', express.static(storageRoot));
    app.use('/storage/uploads', express.static((0, node_path_1.resolve)(storageRoot, 'uploads')));
    app.use('/storage/uploads', express.static((0, node_path_1.resolve)(storageRoot, 'Uploads')));
    app.use('/uploads', express.static((0, node_path_1.resolve)(storageRoot, 'uploads')));
    app.use('/uploads', express.static((0, node_path_1.resolve)(storageRoot, 'Uploads')));
    app.use('/Uploads', express.static((0, node_path_1.resolve)(storageRoot, 'Uploads')));
    app.use('/Uploads', express.static((0, node_path_1.resolve)(storageRoot, 'uploads')));
    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map