const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawl(url) {
  console.log(`Crawling ${url}...`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const links = await page.$$eval('a[href^="/research/"]', (links) => {
    return links.map((link) => link.href);
  });

  const paragraphs = await page.$$eval('p', (paragraphs) => {
    return paragraphs.map((p) => p.textContent);
  });

  if(!fs.existsSync('data.txt')){
    fs.writeFileSync('data.txt', '');
    }

    fs.appendFileSync('data.txt', paragraphs.join('\n\n\n\n'));


  console.log(`Found ${links.length} links and ${paragraphs.length} paragraphs on ${url}`);

  for (let link of links) {
    await crawl(link);
  }

  await browser.close();
}

crawl('https://www.moodys.com/researchandratings/research-type/ratings-assessments-news/-/00300E/00300E/-/-1/0/-/0/-/-/-/-/-/-/-/-/global/pdf/-/rra');
