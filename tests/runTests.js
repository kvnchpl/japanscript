const fs = require("fs");
const path = require("path");

const testDir = path.join(__dirname, "testCases");

// Helper function to run a single test
function runTest(testFile) {
  console.log(`Running ${testFile}...`);
  try {
    require(path.join(testDir, testFile))();
    console.log(`✅ ${testFile} passed`);
  } catch (error) {
    console.error(`❌ ${testFile} failed`);
    console.error(error.message);
    process.exitCode = 1; // Mark the process as failed
  }
}

// Run all test files in the testCases directory
fs.readdirSync(testDir)
  .filter((file) => file.endsWith(".js"))
  .forEach(runTest);