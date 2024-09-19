import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { environment } from "../../loaders/environment.loader.js";
import { User } from "../../models/core/user.model.js";
import { Item } from "../../models/lib/item.model.js";

const fetchInstallationDetails = async (installationId, user) => {
    try {
        const appId = environment.GITHUB_APP_ID;
        const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
        // const privateKeyPath = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
        // const privateKey = fs.readFileSync(privateKeyPath, "utf8");
        const auth = createAppAuth({
            appId: appId,
            privateKey: privateKey,
            webhooks: {
                secret: environment.GITHUB_WEBHOOK_SECRET
            },
            installationId: installationId
        });
        const installationAuthentication = await auth({ type: 'installation' });

        const octokit = new Octokit({ auth: installationAuthentication.token });

        await octokit.apps.listReposAccessibleToInstallation({
            installation_id: installationId
        });
        user.integration.github.installationId = installationId
        user.integration.github.connected = true
        user.save();
    } catch (error) {
        console.error('Error fetching installation details:', error);
        throw error;
    }
};

const processWebhookEvent = async (event, payload) => {
    const installationId = payload.installation.id;
    const issueOrPR = payload.issue || payload.pull_request;
    const repository = payload.repository;

    if (!issueOrPR) {
        console.log('No issue or pull request found in the payload.');
        return;
    }
    const user = await User.findOne({ 'integration.github.installationId': installationId });
    if (!user) {
        return;
    }
    const userId = user._id;

    const existingItem = await Item.findOne({
        id: issueOrPR.id,
        type: event === 'issues' ? 'githubIssue' : 'githubPullRequest',
        user: userId
    });

    if (existingItem) {
        await Item.findByIdAndUpdate(existingItem._id, {
            title: issueOrPR.title,
            description: issueOrPR.body,
            'metadata.labels': issueOrPR.labels,
            'metadata.state': issueOrPR.state,
            'metadata.url': issueOrPR.html_url,
            'metadata.repo': repository.name,
            'metadata.owner': repository.owner.login,
            'metadata.assignees': issueOrPR.assignees,
            updatedAt: issueOrPR.updated_at
        }, { new: true });
        console.log(`Updated ${event} with ID: ${issueOrPR.id}`);
    } else {
        // Create new item
        const newItem = new Item({
            title: issueOrPR.title,
            type: event === 'issues' ? 'githubIssue' : 'githubPullRequest',
            id: issueOrPR.id,
            description: issueOrPR.body,
            user: userId,
            metadata: {
                labels: issueOrPR.labels,
                state: issueOrPR.state,
                url: issueOrPR.html_url,
                repo: repository.name,
                owner: repository.owner.login,
                assignees: issueOrPR.assignees,
                repository_url: issueOrPR.repository_url,
                number: issueOrPR.number
            },
            createdAt: issueOrPR.created_at,
            updatedAt: issueOrPR.updated_at
        });

        await newItem.save();
        console.log(`Saved new ${event} with ID: ${issueOrPR.id}`);
    }
};

export {
    fetchInstallationDetails,
    processWebhookEvent
};
