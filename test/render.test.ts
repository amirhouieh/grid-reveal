import { GridReveal } from "../src";

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

const url = `https://portfolio.amir.cloud`;

describe("renderUrl", () => {
    const grider = new GridReveal();

    it("initializing browser", async () => {
        await grider.init();
        expect(grider.browser).not.toBeNull();
    }, 6000)

    it("render url: output base64",async() => {
        const data = await grider.renderPage(url,opts);
        expect(typeof data.screenshots.original).toBe("string");
        expect(typeof data.screenshots.grid).toBe("string");
        expect(typeof data.options.renderOptions).not.toBe("undefined");
        expect(data.options.renderOptions.sizeThreshold).toEqual(opts.renderOptions.sizeThreshold);
        expect(data.options.renderOptions.textLength).toEqual(opts.renderOptions.textLength);
    }, 20000);


    it("render url: output buffer with path",async() => {
        const data = await grider.renderPage<"binary">(url,
            {
                ...opts,
                screenshotOptions: {
                    encoding: "binary"
                }
            }
        );

        expect(typeof data.screenshots.original).toBe("object");
        expect(typeof data.screenshots.grid).toBe("object");
        expect(typeof data.options.renderOptions).not.toBe("undefined");
        expect(data.options.renderOptions.sizeThreshold).toEqual(opts.renderOptions.sizeThreshold);
        expect(data.options.renderOptions.textLength).toEqual(opts.renderOptions.textLength);

    }, 20000)
})

