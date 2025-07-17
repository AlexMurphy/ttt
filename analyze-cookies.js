const fs = require('fs').promises;
const path = require('path');

async function analyzeCookieData() {
  const dataDir = path.join(__dirname, 'data-export');
  const files = await fs.readdir(dataDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  const projectData = {};
  
  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file);
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const project = data.project;
    if (!projectData[project]) {
      projectData[project] = {
        runs: [],
        consistentCookiesAfter: new Set(),
        avgCookieChange: 0,
        alwaysUpdatesConsent: true
      };
    }
    
    projectData[project].runs.push({
      cookieCountBefore: data.cookieCountBefore,
      cookieCountAfter: data.cookieCountAfter,
      cookieCountChange: data.customizationResults.cookieCountChange,
      consentCookieUpdated: data.customizationResults.consentCookieUpdated,
      cookiesAfter: data.cookiesAfter.map(c => ({ name: c.name, domain: c.domain }))
    });
    
    // Track if consent is always updated
    if (!data.customizationResults.consentCookieUpdated) {
      projectData[project].alwaysUpdatesConsent = false;
    }
  }
  
  // Analyze patterns
  for (const [project, data] of Object.entries(projectData)) {
    const changes = data.runs.map(r => r.cookieCountChange);
    data.avgCookieChange = Math.round(changes.reduce((a, b) => a + b, 0) / changes.length);
    data.minChange = Math.min(...changes);
    data.maxChange = Math.max(...changes);
    
    // Find cookies that appear in ALL runs after customization
    const cookieCountsAfter = {};
    data.runs.forEach(run => {
      run.cookiesAfter.forEach(cookie => {
        const key = `${cookie.name}@${cookie.domain}`;
        cookieCountsAfter[key] = (cookieCountsAfter[key] || 0) + 1;
      });
    });
    
    data.consistentCookiesAfter = Object.entries(cookieCountsAfter)
      .filter(([key, count]) => count === data.runs.length)
      .map(([key]) => key);
  }
  
  console.log('=== COOKIE ANALYSIS RESULTS ===\n');
  
  for (const [project, data] of Object.entries(projectData)) {
    console.log(`📱 ${project.toUpperCase()}`);
    console.log(`   Runs analyzed: ${data.runs.length}`);
    console.log(`   Always updates consent: ${data.alwaysUpdatesConsent}`);
    console.log(`   Cookie count change: ${data.minChange}-${data.maxChange} (avg: ${data.avgCookieChange})`);
    console.log(`   Consistent cookies after customization:`);
    data.consistentCookiesAfter.forEach(cookie => {
      console.log(`     ✓ ${cookie}`);
    });
    console.log('');
  }
}

analyzeCookieData().catch(console.error);
