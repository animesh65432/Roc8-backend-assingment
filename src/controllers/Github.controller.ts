import { Request, Response } from "express"
import githubAPI from "../GithubApi"
import Config from "../config"

const GetdataForGithubProfile = async (req: Request, res: Response) => {
    try {
        const userResponse = await githubAPI.get(`/users/${Config.GITHUB_USERNAME}`);
        const userData = userResponse.data;


        const reposResponse = await githubAPI.get(`/users/${Config.GITHUB_USERNAME}/repos`);
        const reposnumber = reposResponse.data.length
        const reposData = reposResponse.data.map((repo: any) => ({
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub data' })
    }
}

const Get_data_about_repo = async (req: Request, res: Response) => {
    try {
        const { repoName } = req.params
        const repoResponse = await githubAPI.get(`/repos/${Config.GITHUB_USERNAME}/${repoName}`);
        const repoData = repoResponse.data;
        const languagesResponse = await githubAPI.get(`/repos/${Config.GITHUB_USERNAME}/${repoName}/languages`);
        const languagesData = languagesResponse.data;
        const commitsResponse = await githubAPI.get(`/repos/${Config.GITHUB_USERNAME}/${repoName}/commits`, {
            params: { per_page: 10 }
        });
        const commitsData = commitsResponse.data.map((commit: any) => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
        }));
        const issuesResponse = await githubAPI.get(`/repos/${Config.GITHUB_USERNAME}/${repoName}/issues`, {
            params: { state: 'open' }
        });
        const issuesData = issuesResponse.data.map((issue: any) => ({
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

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch repository data' });

    }
}

const create_new_issues = async (req: Request, res: Response) => {
    try {
        const { repoName } = req.params;
        const { title, body } = req.body;
        if (!title || !body) {
            res.status(400).json({ error: 'Title and body are required fields' });
        }
        const response = await githubAPI.post(`/repos/${Config.GITHUB_USERNAME}/${repoName}/issues`, {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create issue' });
    }
}
export { GetdataForGithubProfile, Get_data_about_repo, create_new_issues }