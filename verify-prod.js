const puppeteer = require('puppeteer');

(async () => {
    console.log('🚀 Launching local browser for PRODUCTION check...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1000 });

        // Log in
        console.log('🔑 Logging in as student to PRODUCTION...');
        await page.goto('https://surfapp-two.vercel.app/login', { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for form to appear
        await page.waitForSelector('input[name="email"]', { timeout: 10000 });

        await page.type('input[name="email"]', 'carlos.martinez@example.com');
        await page.type('input[name="password"]', 'password123');

        // Submit and wait for redirect
        console.log('🚀 Clicking submit...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }),
            page.click('button[type="submit"]'),
        ]);

        console.log('✅ Login submitted. Checking URL...');
        console.log('Current URL:', page.url());

        // Go to instructor page directly
        console.log('🌊 Navigating to instructor profile...');
        await page.goto('https://surfapp-two.vercel.app/instructor/ffb74655-40f4-45a7-9d42-3808dd9f710a', { waitUntil: 'domcontentloaded', timeout: 60000 });

        await page.evaluate(() => window.scrollBy(0, 600));
        // Wait a bit for JS to hydrate
        await new Promise(r => setTimeout(r, 5000));

        console.log('📸 Capturing screenshot...');
        await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/b6d26104-ef21-4f72-b063-7804d30bf05d/production_proof_booking.png' });

        const content = await page.content();
        if (content.includes('Reservar 14:00') || content.includes('Reservar')) {
            console.log('✅ PASS: Found "Reservar" text on PRODUCTION');
        } else {
            console.log('❌ FAIL: "Reservar" text not found on PRODUCTION');
        }

    } catch (error) {
        console.error('❌ Error in verification:', error);
        if (typeof browser !== 'undefined') {
            const pages = await browser.pages();
            if (pages.length > 0) {
                await pages[0].screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/b6d26104-ef21-4f72-b063-7804d30bf05d/prod_error_screenshot.png' });
                console.log('📸 Captured error screenshot');
            }
        }
    } finally {
        await browser.close();
    }
})();
