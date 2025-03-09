"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Config = {
    PORT: process.env.PORT,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
};
exports.default = Config;
