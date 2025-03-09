import axios from "axios";
import config from "../config"

const githubAPI = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${config.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});

export default githubAPI