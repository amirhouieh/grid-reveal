#Web Grider 
A nodejs package which draw the grid behind webpages

## Use
```typescript
import {WebGrider} from "webgrider"
const g = new WebGrider();
await g.init();
const {originalBase64, gridBase64} = await g.renderPage("ENCODED URL", opts);
```

## Examples
![youtube-homepage](examples/1475803206342-normal.png?raw=true "youtube homepage | normal view")
![youtube-homepage](examples/1475803206342-grid.png?raw=true "youtube homepage | grid view")


## development
- packaged by [tsdx](https://github.com/jaredpalmer/tsdx)
