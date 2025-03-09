"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_new_issues = exports.Get_data_about_repo = exports.GetdataForGithubProfile = void 0;
const GithubApi_1 = __importDefault(require("../GithubApi"));
const config_1 = __importDefault(require("../config"));
const GetdataForGithubProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userResponse = yield GithubApi_1.default.get(`/users/${config_1.default.GITHUB_USERNAME}`);
        const userData = userResponse.data;
        const reposResponse = yield GithubApi_1.default.get(`/users/${config_1.default.GITHUB_USERNAME}/repos`);
        const reposnumber = reposResponse.data.length;
        const reposData = reposResponse.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            created_at: repo.created_at,
            updated_at: repo.updated_at
        }));
        res.status(200).json({
            profile: {
                login: userData.login,
                name: userData.name,
                bio: userData.bio,
                public_repos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
            },
            repodata: {
                repositories: reposData,
                reposnumber
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub data' });
    }
});
exports.GetdataForGithubProfile = GetdataForGithubProfile;
const Get_data_about_repo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { repoName } = req.params;
        const repoResponse = yield GithubApi_1.default.get(`/repos/${config_1.default.GITHUB_USERNAME}/${repoName}`);
        const repoData = repoResponse.data;
        const languagesResponse = yield GithubApi_1.default.get(`/repos/${config_1.default.GITHUB_USERNAME}/${repoName}/languages`);
        const languagesData = languagesResponse.data;
        const commitsResponse = yield GithubApi_1.default.get(`/repos/${config_1.default.GITHUB_USERNAME}/${repoName}/commits`, {
            params: { per_page: 10 }
        });
        const commitsData = commitsResponse.data.map((commit) => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
        }));
        const issuesResponse = yield GithubApi_1.default.get(`/repos/${config_1.default.GITHUB_USERNAME}/${repoName}/issues`, {
            params: { state: 'open' }
        });
        const issuesData = issuesResponse.data.map((issue) => ({
            number: issue.number,
            title: issue.title,
            user: issue.user.login,
            created_at: issue.created_at,
            html_url: issue.html_url
        }));
        res.json({
            repository: {
                id: repoData.id,
                name: repoData.name,
                full_name: repoData.full_name,
                owner: repoData.owner.login,
                description: repoData.description,
                html_url: repoData.html_url,
                stars: repoData.stargazers_count,
                watchers: repoData.watchers_count,
                forks: repoData.forks_count,
                open_issues: repoData.open_issues_count,
                language: repoData.language,
                created_at: repoData.created_at,
                updated_at: repoData.updated_at,
                pushed_at: repoData.pushed_at,
                default_branch: repoData.default_branch,
                size: repoData.size
            },
            languages: languagesData,
            recent_commits: commitsData,
            open_issues: issuesData
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch repository data' });
    }
});
exports.Get_data_about_repo = Get_data_about_repo;
const create_new_issues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { repoName } = req.params;
        const { title, body } = req.body;
        if (!title || !body) {
            res.status(400).json({ error: 'Title and body are required fields' });
        }
        const response = yield GithubApi_1.default.post(`/repos/${config_1.default.GITHUB_USERNAME}/${repoName}/issues`, {
            title,
            body
        });
        res.status(201).json({
            message: 'Issue created successfully',
            issue_url: response.data.html_url,
            issue: {
                number: response.data.number,
                title: response.data.title,
                body: response.data.body,
                created_at: response.data.created_at
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create issue' });
    }
});
exports.create_new_issues = create_new_issues;
