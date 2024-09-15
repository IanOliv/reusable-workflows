const core = require('@actions/core');
const github = require('@actions/github');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function run() {
  try {
    const { appAuthentication, installationAuthentication, octokit } = await getAuth();
    // const branch = core.getInput('private-key');
    // console.log(JSON.stringify(github));
    // console.log(JSON.stringify(core));

    const {  owner , } = github.context.repo;
    // const repo = github.context.repo.repo;
    const repo = core.getInput('repo');
    const path =  ''; // Root directory, change this to list files in a specific directory
    const path_file = core.getInput('path');
    const branch = core.getInput('branch');
    const message = core.getInput('message');
    // const content = Buffer.from('Hello Worldddddddd!').t;oString('base64');
    const content = core.getInput('content');

    // const { data: files } = await octokit.rest.repos.getContent({
    //   owner,
    //   repo,
    //   path
    // });

    // for (const file of files) {
    //   console.log(`- ${ file.name }`);
    // }

    // const branches = await getBranches({ owner, repo, octokit });
    // console.log('Branches', branches);
    const file = await createFile({ owner, repo, octokit,
       path: path_file, message, content,branch });
    // console.log('File created', file);

  } catch (error) {
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
  const { data: files } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentRaw
  });
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


