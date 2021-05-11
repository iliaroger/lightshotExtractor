const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const stream = require('stream').Transform;
const puppeteer = require('puppeteer');
const port = 3000;

app.listen(port, () => {
  const url = 'https://prnt.sc/';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomCharacter = () =>
    alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomNumber = () => Math.floor(Math.random() * 10);
  setInterval(() => {
    const newUrl = `${url}${randomCharacter()}${randomCharacter()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;
    const runProcess = async () => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(newUrl);
        await page.click('.css-47sehv');
        const imageData = await page.evaluate(() =>
          document.querySelector('.screenshot-image').getAttribute('src')
        );
        try {
          https
            .request(`${imageData}`, (response) => {
              let data = new stream();

              response.on('data', (chunk) => {
                if (data !== null) {
                  data.push(chunk);
                }
                return;
              });

              response.on('end', () => {
                if (data._readableState.buffer.head === null) return;
                fs.writeFileSync(
                  `./images/image${randomNumber()}${randomCharacter()}${randomNumber()}${randomNumber()}.png`,
                  data.read()
                );
                console.log('image added');
              });
            })
            .end();
        } catch (err) {
          if (err) return;
        }
        await browser.close();
      } catch (error) {
        console.error(error);
      }
    };
    runProcess();
  }, 2000);
});
