const path = require('path');
const os = require('os');

document.getElementById('output-path').innerText = path.join(os.homedir(), 'cio');

// Add functionality to allow user to set path