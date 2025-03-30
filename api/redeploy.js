
module.exports = async () => {
// restart the server
    const restart_url = `https://api.vercel.com/v13/deployments`;
    const restart_body = {
        name: 'production',
        gitSource: {
            ref: 'main',
            repoId: '662550813',
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
        .catch((err) => {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Error restarting server',
                    error: err.message
                })
            }
        });

    // return response
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Server restarted successfully'
        })
    }

}
