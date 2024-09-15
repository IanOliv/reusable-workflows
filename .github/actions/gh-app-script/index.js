const core = require('@actions/core');
const github = require('@actions/github');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function run() {
  try {
    const appId = core.getInput('app-id');
    const installationId = core.getInput('installation-id');
    const privateKey = core.getInput('private-key');
    const pp = privateKey.replace(/\\n/g, '\n');
    // console.log(pp)
    // console.log(`App ID: ${appId}`);
    // console.log(`Installation ID: ${installationId}`);
    // console.log(`Private Key: ${privateKey}`);


    const auth = createAppAuth({
      appId : process.env.GH_APP_ID,
      privateKey : privateKey,
      clientId: process.env.GH_APP_CLIENT_ID,
      clientSecret: process.env.GH_APP_CLIENT_SECRET
    });

    console.log('Authenticating as installation');
    const appAuthentication = await auth({ type: 'app' });
    const installationAuthentication = await auth({ type: 'installation', installationId: installationId });
    console.log(installationAuthentication);
    console.log(appAuthentication);
    console.log('Authenticated as installation');

    // const octokit = new Octokit({
    //   auth: installationAuthentication.token
    // });

    // const owner = github.context.repo.owner;
    // const repo = github.context.repo.repo;
    // const path = ''; // Root directory, change this to list files in a specific directory

    // console.log(`Files in ${owner}`);
    // console.log(`Files in ${repo}`);
    // console.log(`Files in ${path}`);

    // const { data: files } = await octokit.rest.repos.getContent({
    //   owner,
    //   repo,
    //   path
    // });

    // for (const file of files) {
    //   console.log(`- ${file.name}`);
    // }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();