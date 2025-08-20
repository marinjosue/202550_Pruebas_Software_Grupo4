const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

class Logger {
  constructor() {
    this.appLog = path.join(logDir, 'app.log');
    this.errorLog = path.join(logDir, 'error.log');
    this.debugLog = path.join(logDir, 'debug.log');
  }

  _writeLog(logPath, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      ...data
    };
    
    const logString = `${JSON.stringify(logEntry)}\n`;
    
    fs.appendFile(logPath, logString, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
    
    return logEntry;
  }

  info(message, data = {}) {
    const logEntry = this._writeLog(this.appLog, message, data);
    console.log(`[INFO] ${message}`, data);
    return logEntry;
  }

  error(message, data = {}) {
    const logEntry = this._writeLog(this.errorLog, message, data);
    console.error(`[ERROR] ${message}`, data);
    return logEntry;
  }

  warn(message, data = {}) {
    const logEntry = this._writeLog(this.appLog, message, data);
    console.warn(`[WARN] ${message}`, data);
    return logEntry;
  }

  debug(message, data = {}) {
    // Solo registrar debug en entorno de desarrollo
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this._writeLog(this.debugLog, message, data);
      console.debug(`[DEBUG] ${message}`, data);
      return logEntry;
    }
    return null;
  }

  logRequest(req, res, next) {
    const start = Date.now();
    
    // Una vez que la respuesta termine
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent') || 'unknown'
      };
      
      // Log diferente según el código de estado
      if (res.statusCode >= 500) {
        this.error(`${req.method} ${req.originalUrl} ${res.statusCode}`, logData);
      } else if (res.statusCode >= 400) {
        this.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`, logData);
      } else {
        this.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, logData);
      }
    });
    
    next();
  }
  
  logDbOperation(operation, table, data = {}) {
    this.debug(`DB ${operation} on ${table}`, data);
  }
  
  logAuthEvent(event, userId, data = {}) {
    this.info(`AUTH ${event}`, { userId, ...data });
  }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;