const update_env_variable = require('../functions/update_env_variable');

module.exports = async (req, res) => {
    // get version from the request
    const version = req.query.version;
    if (!version || isNaN(Number(version))) {
        return res.status(400).send({ error: 'Version not specified' });
    }

    // update the environment variable
    update_env_variable(version);

    res.status(200).send({ message: 'Environment variable updated successfully' });
}