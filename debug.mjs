import puppeteer from 'puppeteer';
const b = await puppeteer.launch();
const p = await b.newPage();
p.on('console', m => console.log('LOG:', m.text()));
p.on('pageerror', e => console.error('ERR:', e.message));
await p.goto('http://localhost:5173', {waitUntil: 'networkidle0'});
await b.close();
