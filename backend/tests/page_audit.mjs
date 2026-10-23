import assert from "node:assert";

const BACKEND_URL = "http://localhost:3000";
const FRONTEND_URL = "http://localhost:5173";

console.log("🔍 Checking all pages one by one for complete operational status...\n");

async function checkAllPages() {
  const auditReport = [];

  // Helper to test frontend route delivery
  async function testRoute(name, routePath, expectedApiUrl, authRequired = false, token = null) {
    try {
      // 1. Verify frontend serves the route
      const feRes = await fetch(`${FRONTEND_URL}${routePath}`);
      assert.strictEqual(feRes.status, 200, `Frontend did not return 200 for ${routePath}`);
      const html = await feRes.text();
      assert.ok(html.includes("id=\"root\""), "React root missing");

      // 2. Verify backing API endpoint
      let apiStatus = "N/A";
      if (expectedApiUrl) {
        const headers = {};
        if (authRequired && token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const apiRes = await fetch(`${BACKEND_URL}${expectedApiUrl}`, { headers });
        apiStatus = `${apiRes.status} ${apiRes.statusText}`;
        assert.ok(apiRes.status >= 200 && apiRes.status < 300, `API failed with status ${apiRes.status}`);
      }

      auditReport.push({
        Page: name,
        Route: routePath,
        "Frontend Status": "200 OK ✅",
        "API Status": apiStatus === "N/A" ? "Client-Only" : `${apiStatus} ✅`,
        Result: "WORKING"
      });
      console.log(`✅ [WORKING] ${name.padEnd(25)} -> ${routePath}`);
    } catch (err) {
      auditReport.push({
        Page: name,
        Route: routePath,
        "Frontend Status": "ERROR ❌",
        "API Status": err.message,
        Result: "FAILED"
      });
      console.log(`❌ [FAILED]  ${name.padEnd(25)} -> ${err.message}`);
    }
  }

  // First fetch an existing Movie, Category, Cast ID to test detail pages
  let sampleMovieId = "69f6f016ac91c8856fbca046";
  let sampleCategoryId = "69f6ef5cac91c8856fbca030";
  let sampleCastId = "69f6eff0ac91c8856fbca03c";

  try {
    const [mRes, cRes, aRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/movie/get?limit=1`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/category/get?limit=1`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/cast/get?limit=1`).then(r => r.json())
    ]);
    if (mRes.data?.[0]?._id) sampleMovieId = mRes.data[0]._id;
    if (cRes.data?.[0]?._id) sampleCategoryId = cRes.data[0]._id;
    if (aRes.data?.[0]?._id) sampleCastId = aRes.data[0]._id;
  } catch {}

  // Obtain test authentication token for protected pages
  let testToken = null;
  let testUserId = null;
  try {
    const testEmail = `audit_${Date.now()}@yt.dev`;
    const otpRes = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail })
    }).then(r => r.json());
    const otpCode = otpRes.otp || "123456";

    const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "AuditTester",
        email: testEmail,
        password: "Password123!",
        otp: otpCode
      })
    }).then(r => r.json());
    testToken = regRes.token;
    testUserId = regRes.data?._id;
  } catch (err) {
    console.error("Token setup error:", err.message);
  }

  // Test All 16 Application Pages
  await testRoute("1. Home Dashboard", "/", "/api/movie/get");
  await testRoute("2. Dashboard Alias", "/dashboard", "/api/movie/get");
  await testRoute("3. Explore Videos", "/movies", "/api/movie/get?limit=50");
  await testRoute("4. Video Watch Player", `/movie/${sampleMovieId}`, `/api/movie/get/${sampleMovieId}`);
  await testRoute("5. Creators / Cast", "/cast", "/api/cast/get");
  await testRoute("6. Creator Channel", `/cast/${sampleCastId}`, `/api/cast/get/${sampleCastId}`);
  await testRoute("7. Categories List", "/category", "/api/category/get");
  await testRoute("8. Category Details", `/category/${sampleCategoryId}`, `/api/category/get/${sampleCategoryId}`);
  await testRoute("9. Watch History", "/history", "/api/history", true, testToken);
  await testRoute("10. Offline Downloads", "/downloads", "/api/downloads", true, testToken);
  await testRoute("11. Upload Video Studio", "/movie/create", "/api/category/get", true, testToken);
  await testRoute("12. Edit Video", `/movie/update/${sampleMovieId}`, `/api/movie/get/${sampleMovieId}`, true, testToken);
  await testRoute("13. Create Category", "/category/create", null, true, testToken);
  await testRoute("14. Create Creator/Cast", "/cast/create", null, true, testToken);
  await testRoute("15. User Profile", `/profile/${testUserId || "me"}`, `/api/user/get/${testUserId || "me"}`, false, testToken);
  await testRoute("16. Sign In (Login)", "/login", null);
  await testRoute("17. Sign Up (Register)", "/register", null);

  console.log("\n========================================================");
  console.log("📊 ALL PAGES AUDIT RESULT SUMMARY");
  console.log("========================================================");
  console.table(auditReport);
}

checkAllPages();
