const update_env_variable = (version_number) => {
    const url = `https://api.vercel.com/v10/projects/${process.env.PROJECT_ID}/env/${process.env.VERSION_VARIABLE_ID}`;

    const body = {
        value: version_number
    };

    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
        },
        body: JSON.stringify(body)
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

    // restart the server
    const restart_url = `https://api.vercel.com/v13/deployments`;
    const restart_body = {
        name: 'production',
        gitSource: {
            ref: process.env.GIT_COMMIT_REF,
            repoId: process.env.GIT_REPO_ID,
            type: 'github',
        }
    }

    const restart_options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
        },
        body: JSON.stringify(restart_body)
    }

    fetch(restart_url, restart_options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));



}


module.exports = update_env_variable;