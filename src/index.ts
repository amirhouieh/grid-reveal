import puppeteer, { Browser, EvaluateFn, JSONObject, ScreenshotOptions, Viewport } from "puppeteer";
import { drawTheGrid } from "./renderer";

export type TWebGridStateOpt = {
    busy?: boolean;
}

export type TWebGridState = {
    busy: boolean;
}

export type TWebGridRenderOutput = {
    originalBase64: string;
    gridBase64: string;
    options: {
        viewPort: Viewport,
        renderOptions: TWebGriderRenderOptions
    };
}

export type TWebGriderRenderPageOptions = {
    viewPort?: Viewport,
    renderOptions?: TWebGriderRenderOptions
}

export interface TWebGriderRenderOptions{
    textLength?: number|null,
    sizeThreshold?: number|null,
}

const defaultRenderOpt: TWebGriderRenderOptions = {
    textLength: 100,
    sizeThreshold: 0.1
}

const defaultViewPort: Viewport = {
    width: 1400,
    height: 1200
}

const defaultScreenshotOptions: ScreenshotOptions = {
    fullPage: true,
    omitBackground: true,
    encoding: "base64"
}

export class WebGrider {
    browser!: Browser;
    state: TWebGridState;

    constructor() {
        this.state = {busy: false};
    }

    async init(){
        this.browser = await puppeteer.launch();
    }

    private setState(state: TWebGridStateOpt){
        this.state = {...this.state, ...state};
    }

    getRenderOptions(opt: TWebGriderRenderOptions = defaultRenderOpt): TWebGriderRenderOptions{
        /*Int value, if presents, elements with less text length will be ignored*/
        const textLength = typeof opt.textLength==="undefined"? defaultRenderOpt.textLength: opt.textLength;

        /*float value 0-1, if present the more the bigger blocks (less details)*/
        const sizeThreshold = typeof opt.sizeThreshold==="undefined"? defaultRenderOpt.sizeThreshold: opt.sizeThreshold;

        return {textLength, sizeThreshold};
    }

    getViewportOptions(opt: Viewport|undefined): Viewport {
        return {...defaultViewPort, ...(opt || {})}
    }

    async renderPage(
        url: string,
        options: TWebGriderRenderPageOptions = {}
    ): Promise<TWebGridRenderOutput> {

        //For later in case we want to close browser on idle
        if(!this.browser){
            await this.init();
        }

        const viewportOpt = this.getViewportOptions(options.viewPort);
        const renderOpt = this.getRenderOptions(options.renderOptions) as JSONObject;

        this.setState({busy: true});

        //open browser page
        const page = await this.browser.newPage();
        // page.on('console', consoleObj => console.log(consoleObj.text()));

        //set the window size
        await page.setViewport(viewportOpt);

        //open and load the url
        await page.goto(url, {waitUntil: 'networkidle2'})

        //take the screenshot of original view
        const originalBase64 = await page.screenshot(defaultScreenshotOptions);

        //drawing the grid
        await page.evaluate<EvaluateFn<TWebGriderRenderOptions>>(drawTheGrid, renderOpt);

        //take the screenshot of the view with the grid
        const gridBase64 = await page.screenshot(defaultScreenshotOptions)

        //close the page
        await page.close();

        this.setState({busy: false});

        //return both screenshots in base64 format
        //@ts-ignore
        return {originalBase64, gridBase64, options: {viewPort: viewportOpt, renderOptions: renderOpt}};
    }
}
