import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173/doctor/dashboard ...');
  await page.goto('http://localhost:5173/doctor/dashboard', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation Error:', e));
  
  // Wait a bit to ensure everything is rendered
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
