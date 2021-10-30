#Web Grider 
A nodejs package which draw the grid behind webpages

## Use
```typescript
import { GridReveal } from "grid-reveal";
const g = new GridReveal();
await g.init();
const {originalBase64, gridBase64} = await g.renderPage("ENCODED_URL", opts);
```

## Options
```typescript
interface Viewport {
    //he page width in pixels.
    width: number;
     //The page height in pixels.
    height: number;
}

interface TGridRevealRenderOptions{
    /*Int value, if presents, elements with less text length will be ignored*/
    textLength?: number|null,

    /*float value 0-1, if present the more the bigger blocks (less details)*/
    sizeThreshold?: number|null,
}

type TGridRevealRenderPageOptions = {
    viewPort?: Viewport,
    renderOptions?: TGridRevealRenderOptions
}

```

## Examples
![youtube-homepage](examples/1475803206342-normal.png?raw=true "youtube homepage | normal view")
![youtube-homepage](examples/1475803206342-grid.png?raw=true "youtube homepage | grid view")


## development
- packaged by [tsdx](https://github.com/jaredpalmer/tsdx)
