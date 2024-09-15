const core = require('@actions/core');
const github = require('@actions/github');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function run() {
  try {
    const {appAuthentication,installationAuthentication}=getAuth();
    // const appAuthentication = await auth({ type: 'app' });
    // const installationAuthentication = await auth({ type: 'installation', installationId: installationId });
    console.log(installationAuthentication);
    console.log(appAuthentication);
    console.log('Authenticated as installation');

    const octokit = new Octokit({
      auth: installationAuthentication.token
    });

    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const path = ''; // Root directory, change this to list files in a specific directory

    console.log(`Files in ${owner}`);
    console.log(`Files in ${repo}`);
    console.log(`Files in ${path}`);

    const { data: files } = await octokit.rest.repos.getContent({
      owner,
      repo:'state',
      path
    });

    for (const file of files) {
      console.log(`- ${file.name}`);
    }

  


  } catch (error) {
    core.setFailed(error.message);
  }
}




async function getAuth() {
    const {GH_APP_CLIENT_ID, 
          GH_APP_CLIENT_SECRET, GH_APP_PRIVATE_KEY,
          GH_APP_ID,GH_APP_INSTALLATION_ID} = process.env;


    const auth = createAppAuth({
      appId :GH_APP_ID,
      privateKey : GH_APP_PRIVATE_KEY,
      clientId:GH_APP_CLIENT_ID,
      clientSecret:GH_APP_CLIENT_SECRET
    });


    const appAuthentication = await auth({ type: 'app' });
    const installationAuthentication = await auth({ type: 'installation', installationId: GH_APP_INSTALLATION_ID });

    return {appAuthentication, installationAuthentication};
}
async function getBranches(params) {
  
  
}
async function getFiles(params) {
    
}

async function createFile(params) {
    
}

async function updateFile(params) {

}

async function deleteFile(params) {
      
}

async function getCommits(params) {
    
}



async function getRepo(params) {
    
}





run();


