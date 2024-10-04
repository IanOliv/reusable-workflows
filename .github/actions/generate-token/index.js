const core = require('@actions/core');
const { createAppAuth } = require('@octokit/auth-app');

async function run() {
  try {
    const appId = core.getInput('app_id');
    const privateKey = core.getInput('private_key');

    const auth = createAppAuth({
      appId,
      privateKey,
    });

    const installationAuthentication = await auth({
      type: 'installation',
    });

    core.setOutput('token', installationAuthentication.token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();