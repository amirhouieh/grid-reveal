import { ScreenshotOptions, Viewport } from "puppeteer";
import { TGridRevealRenderOptions } from "./gridrevealpage.class";

export const defaultViewPort: Viewport = {
    width: 1400,
    height: 1200
}

export const defaultRenderOpt: TGridRevealRenderOptions = {
    textLength: 100,
    sizeThreshold: 0.1
}

export const defaultScreenshotOptions_BASE64: ScreenshotOptions = {
    fullPage: true,
    omitBackground: true,
    encoding: "base64"
}

export const defaultScreenshotOptions_FILE: ScreenshotOptions = {
    fullPage: true,
    omitBackground: true,
}
