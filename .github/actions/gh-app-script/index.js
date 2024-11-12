const core = require('@actions/core');
const github = require('@actions/github');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function run() {
  try {

      const appId = core.getInput('app-id');
      const privateKey = core.getInput('private-key');
      const installationId = core.getInput('installation-id');
      
      const auth = createAppAuth({
          appId,
          privateKey,
            installationId
      });

        const { token } = await auth({ type: 'installation', installationId }); // Modify this line
      core.setOutput('token', token);

  } catch (error) {
    console.error(error);
    console.table(error);
    core.setFailed(error.message);
  }
}




async function getAuth() {
  const { GH_APP_CLIENT_ID,
    GH_APP_CLIENT_SECRET, GH_APP_PRIVATE_KEY,
    GH_APP_ID, GH_APP_INSTALLATION_ID } = process.env;


  const auth = createAppAuth({
    appId: GH_APP_ID,
    privateKey: GH_APP_PRIVATE_KEY,
    clientId: GH_APP_CLIENT_ID,
    clientSecret: GH_APP_CLIENT_SECRET
  });


  const appAuthentication = await auth({ type: 'app' });
  const installationAuthentication = await auth({ type: 'installation', installationId: GH_APP_INSTALLATION_ID });
  const octokit = new Octokit({
    auth: installationAuthentication.token
  });
  return { appAuthentication, installationAuthentication, octokit };
}
async function getBranches(params) {
  const { owner, repo, octokit } = params;
  const { data: branches } = await octokit.rest.repos.listBranches({
    owner,
    repo
  });
  return branches;


}

async function createBranch(params) {
  const { owner, repo, octokit , branch, } = params;

  const sha = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: 'heads/main'
  });
  console.log('SHA', sha);
  const { data: branches } = await octokit.rest.git.createRef({
    owner,
    repo,
    ref: 'refs/heads/' + branch,
    sha: sha.data.object.sha
  });
  return branches;
  
}

async function deleteBranch(params) {

  const { owner, repo, octokit ,branch} = params;
  const { data: branches } = await octokit.rest.git.deleteRef({
    owner,
    repo,
    ref: 'heads/'+branch
  });
  return branches;

}


async function getFiles(params) {
  const { owner, repo, octokit } = params;
  const { data: files } = await octokit.rest.repos.getContent({
    owner,
    repo
  });
  return files;
}



async function createFile(params) {
  const { owner, repo, 
    path, message, content,
    octokit } = params;
  const contentRaw = Buffer.from(content).toString('base64')
  console.log('Content raw', contentRaw);
  const { data: files } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentRaw
  });
  console.log('Files', files);
  return files;

}

async function updateFile(params) {
  const { owner, repo, octokit } = params;
  // const contetRaw = Buffer.from('Hello Worldddddddd!').toString('base64')
  const { data: files } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'dddff.txt',
    message: 'Initial commit',
    content: Buffer.from('Hello World!').toString('base64')
  });
  return files;

}

async function deleteFile(params) {
  const { owner, repo, octokit } = params;
  const { data: files } = await octokit.rest.repos.deleteFile({
    owner,
    repo,
    path: 'dddff.txt',
    message: 'Delete file'
  });
  return files;

}

async function getCommits(params) {
  const { owner, repo, octokit } = params;
  const { data: commits } = await octokit.rest.repos.listCommits({
    owner,
    repo
  });
  return commits;

}



async function getRepo(params) {
  const { owner, repo, octokit } = params;
  const { data: repos } = await octokit.rest.repos.get({
    owner,
    repo
  });
  return repos;
}





run();


