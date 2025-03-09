"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const githubAPI = axios_1.default.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${config_1.default.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});
exports.default = githubAPI;
