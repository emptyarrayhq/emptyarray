import { Router } from "express";
import { getAccessTokenController, redirectLinearOAuthLoginController, getMyLinearIssuesController, getTodayLinearIssuesController, getOverdueLinearIssuesController, getLinearIssuesByDateController } from "../../controllers/integration/linear.controller.js";

const router = Router();

router.route("/connect/").get(redirectLinearOAuthLoginController)
router.route("/getAccessToken/").get(getAccessTokenController)
router.route("/issues/my/").get(getMyLinearIssuesController)
router.route("/issues/today/").get(getTodayLinearIssuesController)
router.route("/issues/overdue/").get(getOverdueLinearIssuesController)
router.route("/issues/:date/").get(getLinearIssuesByDateController)

export default router;
