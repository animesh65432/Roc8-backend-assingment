"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const Github = (0, express_1.Router)();
Github.get("/", controllers_1.GetdataForGithubProfile);
Github.get("/:repoName", controllers_1.Get_data_about_repo);
Github.post("/:repoName/issues", controllers_1.create_new_issues);
exports.default = Github;
