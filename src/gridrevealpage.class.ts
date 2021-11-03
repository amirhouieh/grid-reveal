import { Browser, EvaluateFn, JSONObject, Page, ScreenshotOptions, Viewport } from "puppeteer";
import { drawTheGrid } from "./renderer";
import { defaultRenderOpt, defaultScreenshotOptions_BASE64, defaultScreenshotOptions_FILE } from "./gridreveal.configs";
import { getOptions } from "./utils";

export type TGridRevealRenderOptions = {
    textLength?: number|null,
    sizeThreshold?: number|null,
}

export class GridRevealPage{
    page!: Page;
    renderOptions: TGridRevealRenderOptions = defaultRenderOpt;
    debug: boolean = false;

    constructor(public readonly index: number) {}

    getRenderOptions(opt: TGridRevealRenderOptions = defaultRenderOpt): TGridRevealRenderOptions{
        /*Int value, if presents, elements with less text length will be ignored*/
        const textLength = typeof opt.textLength==="undefined"? defaultRenderOpt.textLength: opt.textLength;

        /*float value 0-1, if present the more the bigger blocks (less details)*/
        const sizeThreshold = typeof opt.sizeThreshold==="undefined"? defaultRenderOpt.sizeThreshold: opt.sizeThreshold;

        return {textLength, sizeThreshold};
    }

    async create(browser: Browser, viewport: Viewport): Promise<this>{
        this.page = await browser.newPage();
        await this.page.setViewport(viewport);
        if(this.debug){
            this.page.on('console', consoleObj => console.log(consoleObj.text()));
        }
        return this;
    }

    async open(url: string): Promise<this>{
        await this.page.goto(url, {waitUntil: 'networkidle2'});
        return this;
    }

    async drawGrid(opts: TGridRevealRenderOptions): Promise<this>{
        this.renderOptions = this.getRenderOptions(opts);

        //drawing the grid
        await this.page.evaluate<EvaluateFn<TGridRevealRenderOptions>>(drawTheGrid, this.renderOptions as JSONObject);

        return this;
    }

    async renderBase64(opts?: ScreenshotOptions): Promise<string|void>{
        //@ts-ignore
        return this.page.screenshot(getOptions(defaultScreenshotOptions_BASE64, opts));
    }

    async renderToFile(path: string, opts: ScreenshotOptions): Promise<Buffer|void>{
        //@ts-ignore
        return this.page.screenshot(
            {
                ...getOptions(defaultScreenshotOptions_FILE, opts),
                path
            }
        );
    }

    async close(){
        return this.page.close();
    }
}