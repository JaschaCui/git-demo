const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    try {
        await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        const title = await page.title();
        console.log('Page title:', title);
        
        const canvas = await page.$('#gameCanvas');
        console.log('Canvas found:', !!canvas);
        
        const menuScreen = await page.$('#menu-screen.active');
        console.log('Menu screen visible:', !!menuScreen);
        
        const startBtn = await page.$('#start-btn');
        console.log('Start button found:', !!startBtn);
        
        if (errors.length > 0) {
            console.log('\nConsole errors:');
            errors.forEach(e => console.log('  -', e));
        } else {
            console.log('\nNo console errors detected!');
        }
        
        console.log('\nTest completed successfully!');
    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
