// import { GridReveal } from "../src";
// import { GridRevealPage } from "../src";
const {join} = require("path");
const {GridReveal, GridRevealPage} = require("../dist");

const wait = (time: number): Promise<void> => {
     return new Promise<void>((resolve) => {
         setTimeout(() => resolve(), time);
     });
}

const split = <T>(array: T[], chunk_size: number): T[][] =>
    Array(Math.ceil(array.length / chunk_size))
        .fill(null)
        .map((_, index) => index * chunk_size)
        .map(begin => array.slice(begin, begin + chunk_size));

(async () => {
    const EX_DIR = join(process.cwd(), "examples");

    const urls = [
        new URL(`https://github.com/TypeStrong/ts-node`),
        new URL(`https://advancedweb.hu/how-to-speed-up-puppeteer-scraping-with-parallelization/`),
        new URL(`https://stackoverflow.com/questions/8495687/split-array-into-chunks`),
        new URL(`https://translate.google.com/`),
        new URL(`https://www.google.com/search?q=apple`),
        new URL(`https://github.community/t/i-have-no-idea-what-the-interest-cohort-is/179780`),
        new URL(`https://www.youtube.com/watch?v=dKdN3BgCaJk&ab_channel=ShahreFarang-%D8%B4%D9%87%D8%B1%D9%81%D8%B1%D9%86%DA%AF`),
        new URL(`https://www.iranintl.com/`),
        new URL(`https://fonts.google.com/`),
        new URL(`https://en.wikipedia.org/wiki/New_York_City`),
        new URL(`https://en.wikipedia.org/wiki/Main_Page`),
        new URL(`https://www.zalando.nl/`),
        new URL(`https://amazon.com`),
        new URL(`https://www.coolblue.nl/`)
    ];


    const grid = new GridReveal();
    await grid.init();

    const screenshotOptions = {
        clip: {x: 0, y: 0, width: 1400, height: 1800},
        fullPage: false
    }

    const pageJob = async (page: typeof GridRevealPage, urls: URL[]) => {
        const url = urls.shift();

        if (!url) {
            console.log(page.index, urls.length, "ALL JOBS DONE");
            return Promise.resolve();
        }

        try {
            console.log(page.index, urls.length, "START ", url.host);
            const oPath = join(EX_DIR, `${url.host}-original.png`);
            const gPath = join(EX_DIR, `${url.host}-grid.png`);

            await page.open(url.href);
            await wait(2000);
            await page.renderToFile(oPath, screenshotOptions);
            await page.drawGrid({sizeThreshold: 0.01});
            await page.renderToFile(gPath, screenshotOptions);
            console.log(page.index, urls.length, "DONE", url.host);

            setTimeout(async () => {
                await pageJob(page, urls);
            }, 1000);
        } catch (e) {
            console.log(page.index, "ERROR ", url.host);
            console.log(e.message);
        }
    }

    const numberOfTabs = 3;
    const urlsPerTab = Math.ceil(urls.length/numberOfTabs);
    const urlsPerByPage = split(urls, urlsPerTab);

    const pages = await grid.pages(numberOfTabs);

    await Promise.all(
        pages.map(
            async (page: typeof GridRevealPage) => {
                return pageJob(page, urlsPerByPage[page.index]);
            })
    )

    // setTimeout(async () => {
    //     console.log("done")
    //     await grid.closeAllPages();
    //     await grid.browser.close();
    // }, 5000);
})();