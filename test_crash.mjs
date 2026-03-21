import { chromium } from 'playwright';

(async () => {
    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        // Capture all console messages
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
            }
        });

        // Capture unhandled page exceptions (React crashes)
        page.on('pageerror', err => {
            console.log(`[BROWSER CRASH] ${err.name}: ${err.message}`);
            console.log(err.stack);
        });

        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        
        console.log("Page loaded successfully.");
        await browser.close();
    } catch (err) {
        console.error("Script Error:", err);
    }
})();
