const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}\n`;
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content);
  }

  info(message, meta = {}) {
    const logMessage = this.formatMessage('info', message, meta);
    console.log(logMessage.trim());
    this.writeToFile('app.log', logMessage);
  }

  error(message, meta = {}) {
    const logMessage = this.formatMessage('error', message, meta);
    console.error(logMessage.trim());
    this.writeToFile('error.log', logMessage);
  }

  warn(message, meta = {}) {
    const logMessage = this.formatMessage('warn', message, meta);
    console.warn(logMessage.trim());
    this.writeToFile('app.log', logMessage);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('debug', message, meta);
      console.log(logMessage.trim());
      this.writeToFile('debug.log', logMessage);
    }
  }

  // HTTP request logging
  logRequest(req, res, next) {
    const start = Date.now();
    const { method, url, ip } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      
      this.info(`${method} ${url}`, {
        statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent: req.get('User-Agent')
      });
    });
    
    next();
  }

  // Database operation logging
  logDatabaseOperation(operation, table, meta = {}) {
    this.debug(`Database ${operation} on ${table}`, meta);
  }

  // Authentication logging
  logAuth(action, userId, meta = {}) {
    this.info(`Auth ${action}`, { userId, ...meta });
  }
}

module.exports = new Logger();
