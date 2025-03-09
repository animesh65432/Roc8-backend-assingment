import { Router } from "express"
import { GetdataForGithubProfile, create_new_issues, Get_data_about_repo } from "../../controllers"

const Github = Router()

Github.get("/", GetdataForGithubProfile)
Github.get("/:repoName", Get_data_about_repo)
Github.post("/:repoName/issues", create_new_issues)

export default Github