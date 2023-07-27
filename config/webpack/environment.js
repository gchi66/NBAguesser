const { environment } = require('@rails/webpacker');

// Add an entry point for your application
environment.entry.set('application', './app/javascript/application.js');

module.exports = environment;
