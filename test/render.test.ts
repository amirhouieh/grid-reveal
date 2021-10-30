import { GridReveal } from "../src";

describe("renderUrl", () => {
    const grider = new GridReveal();

    it("initializing browser", async () => {
        await grider.init();
        expect(grider.browser).not.toBeNull();
    }, 6000)

    it("render url",async() => {
        const url = `https://portfolio.amir.cloud`;
        const opts = {
            viewPort: {
                width: 1420,
                height: 800
            },
            renderOptions: {
                sizeThreshold: 0.05,
                textLength: null
            }
        }

        const data = await grider.renderPage(url,opts);

        expect(typeof data.gridBase64).toBe("string");
        expect(typeof data.originalBase64).toBe("string");
        expect(typeof data.options.renderOptions).not.toBe("undefined");
        expect(data.options.renderOptions.sizeThreshold).toEqual(opts.renderOptions.sizeThreshold);
        expect(data.options.renderOptions.textLength).toEqual(opts.renderOptions.textLength);
    }, 20000)
})