import puppeteer, { Browser, Viewport } from "puppeteer";

import { defaultViewPort } from "./gridreveal.configs";
import { GridRevealPage } from "./gridrevealpage.class";
import { getOptions, range } from "./utils";


export type TGridRevealState = {
    busy: boolean;
}


export class GridReveal {
    browser!: Browser;
    state: TGridRevealState;
    _pages: GridRevealPage[] = [];

    constructor() {
        this.state = {busy: false};
    }

    async init(){
        this.browser = await puppeteer.launch();
    }

    private addPage(p: GridRevealPage){
        this._pages.push(p);
    }
    private removePage(p: GridRevealPage){
        this._pages = this._pages.filter((_p) => _p.index !== p.index);
    }

    async page(viewPort?: Viewport): Promise<GridRevealPage>{
        const vOpts = getOptions<Viewport>(defaultViewPort, viewPort);
        const p = new GridRevealPage(this._pages.length);
        await p.create(this.browser, vOpts);
        this.addPage(p);
        return p;
    }

    async closeAllPages(){
        for await (const p of this._pages){
            await p.close();
            this.removePage(p);
        }
    }

    async pages(size: number, viewPort?: Viewport ): Promise<GridRevealPage[]>{
        await this.closeAllPages();
        for await (const _ of range(size)){
            await this.page(viewPort);
        }
        return this._pages;
    }
}
