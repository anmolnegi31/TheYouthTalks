// Simple API test script
console.log("Testing Youth Talks API endpoints...\n");

const testEndpoints = [
  "/api/health",
  "/api/ping",
  "/api/status",
  "/api/forms",
  "/api/categories",
];

async function testAPI() {
  const baseURL = "http://localhost:8080";

  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`);
      const data = await response.json();

      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      if (endpoint === "/api/health") {
        console.log(`   Database: ${data.database}`);
        console.log(`   Message: ${data.message}`);
      }
      if (endpoint === "/api/status") {
        console.log(`   Status: ${data.status}`);
        console.log(`   Database: ${data.database}`);
        console.log(`   Features: ${JSON.stringify(data.features)}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Run if Node.js supports fetch (Node 18+)
if (typeof fetch !== "undefined") {
  testAPI();
} else {
  console.log(
    "Node.js version does not support fetch. API should be accessible at http://localhost:8080/api/health",
  );
}
