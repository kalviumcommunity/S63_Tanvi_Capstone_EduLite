const path = require('path');

// Change the current working directory to the Backend directory
// so that .env loading and file uploads resolve correctly relative to Backend.
process.chdir(path.join(__dirname, 'Backend'));

// Require the actual server entry point in the Backend folder
require('./Backend/server.js');
