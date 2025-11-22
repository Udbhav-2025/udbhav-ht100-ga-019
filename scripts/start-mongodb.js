const { spawn, exec } = require('child_process');
const net = require('net');
const os = require('os');
const fs = require('fs');
const path = require('path');

const MONGODB_PORT = 27017;
const MONGODB_HOST = 'localhost';

/**
 * Check if MongoDB is already running
 */
function checkMongoDBRunning() {
  return new Promise((resolve) => {
    const socket = net.createConnection(MONGODB_PORT, MONGODB_HOST, () => {
      socket.end();
      resolve(true);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.setTimeout(1000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/**
 * Start MongoDB based on the operating system
 */
function startMongoDB() {
  return new Promise((resolve, reject) => {
    const platform = os.platform();

    if (platform === 'win32') {
      // Windows: Try to start MongoDB service
      console.log('🔄 Attempting to start MongoDB service (Windows)...');
      const process = spawn('net', ['start', 'MongoDB'], {
        stdio: 'pipe',
        shell: true,
      });

      let output = '';
      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        output += data.toString();
      });

      process.on('error', (error) => {
        console.warn('⚠️  MongoDB service command not found. Trying alternative methods...');
        tryAlternativeStart().then(resolve).catch(reject);
      });

      process.on('exit', (code) => {
        if (code === 0) {
          console.log('✅ MongoDB service started');
          setTimeout(() => {
            waitForMongoDB().then(resolve).catch(reject);
          }, 3000);
        } else {
          if (output.includes('already been started') || output.includes('already running')) {
            console.log('✅ MongoDB service is already running');
            waitForMongoDB().then(resolve).catch(reject);
          } else {
            console.warn('⚠️  Could not start MongoDB service. Trying alternative...');
            tryAlternativeStart().then(resolve).catch(reject);
          }
        }
      });
    } else if (platform === 'darwin') {
      // macOS: Try brew services first, then mongod
      console.log('🔄 Attempting to start MongoDB (macOS)...');
      exec('brew services start mongodb-community', (error) => {
        if (error) {
          // Fallback to mongod
          tryAlternativeStart().then(resolve).catch(reject);
        } else {
          setTimeout(() => {
            waitForMongoDB().then(resolve).catch(reject);
          }, 3000);
        }
      });
    } else {
      // Linux: Try systemd first
      console.log('🔄 Attempting to start MongoDB (Linux)...');
      exec('sudo systemctl start mongod', (error) => {
        if (error) {
          // Fallback to mongod
          tryAlternativeStart().then(resolve).catch(reject);
        } else {
          setTimeout(() => {
            waitForMongoDB().then(resolve).catch(reject);
          }, 3000);
        }
      });
    }
  });
}

/**
 * Try alternative method to start MongoDB
 */
function tryAlternativeStart() {
  return new Promise((resolve, reject) => {
    const platform = os.platform();

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'db');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (platform === 'win32') {
      // Try mongod.exe directly
      const possiblePaths = [
        'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
        'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
        'C:\\Program Files\\MongoDB\\Server\\5.0\\bin\\mongod.exe',
        'C:\\Program Files\\MongoDB\\Server\\4.4\\bin\\mongod.exe',
        'mongod.exe',
      ];

      const tryPath = (index) => {
        if (index >= possiblePaths.length) {
          reject(new Error('Could not find MongoDB installation. Please install MongoDB or use MongoDB Atlas.'));
          return;
        }

        const mongodPath = possiblePaths[index];
        exec(`"${mongodPath}" --version`, (error) => {
          if (error) {
            tryPath(index + 1);
          } else {
            console.log(`🔄 Starting MongoDB from: ${mongodPath}`);
            const process = spawn(mongodPath, ['--dbpath', dataDir], {
              stdio: 'ignore',
              detached: true,
              shell: true,
            });
            process.unref();
            console.log('✅ MongoDB process started');
            setTimeout(() => {
              waitForMongoDB().then(resolve).catch(reject);
            }, 3000);
          }
        });
      };

      tryPath(0);
    } else {
      // Unix-like: try mongod directly
      console.log('🔄 Starting MongoDB process...');
      const process = spawn('mongod', ['--dbpath', dataDir], {
        stdio: 'ignore',
        detached: true,
      });
      process.unref();
      console.log('✅ MongoDB process started');
      setTimeout(() => {
        waitForMongoDB().then(resolve).catch(reject);
      }, 3000);
    }
  });
}

/**
 * Wait for MongoDB to be ready
 */
function waitForMongoDB(maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      attempts++;
      checkMongoDBRunning().then((isRunning) => {
        if (isRunning) {
          console.log('✅ MongoDB is ready!');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('MongoDB did not start within timeout'));
        } else {
          setTimeout(check, 1000);
        }
      });
    };

    check();
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking if MongoDB is running...');

  const isRunning = await checkMongoDBRunning();

  if (isRunning) {
    console.log('✅ MongoDB is already running!');
    process.exit(0);
  } else {
    console.log('⚠️  MongoDB is not running. Attempting to start...');
    try {
      await startMongoDB();
      console.log('✅ MongoDB started successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to start MongoDB automatically:');
      console.error('   Error:', error.message);
      console.error('');
      console.error('📝 Options:');
      console.error('   1. Start MongoDB manually:');
      console.error('      Windows: net start MongoDB');
      console.error('      Mac/Linux: mongod');
      console.error('   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
      console.error('   3. Continue anyway (will use in-memory database)');
      console.error('');
      // Exit with code 0 to allow the app to continue
      // The app will use in-memory database as fallback
      process.exit(0);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkMongoDBRunning, startMongoDB, waitForMongoDB };
