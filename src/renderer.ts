import { TWebGriderRenderOptions } from "./index";

export type TNode =  Node&HTMLElement;

export const drawTheGrid = (
    args: TWebGriderRenderOptions
) => {
    const GRID_CLASSNAME = "webgrider_grid";
    const HIDE_CLASSNAME = "webgrider_hide";

    /*Int value, if presents, elements with less text length will be ignored*/
    const textLength = args.textLength;

    /*float value 0-1, if present the more the bigger blocks (less details)*/
    const sizeThreshold = args.sizeThreshold;

    const GRID_CSS = [
        'box-shadow: 0px 0px 0px 2px rgba(0,0,0,1) !important',
        'opacity: 1 !important'
    ];

    const RESET_CSS = [
        'background: rgba(0,0,0,0); !important',
        'background-image: none !important',
        'background-color: rgba(0,0,0,0) !important',
        'border: none !important',
        'filter: none !important'
    ];

    const GRID_CSS_RULE = {
        selector: `.${GRID_CLASSNAME}`,
        style: GRID_CSS.join(";")+";"
    };

     const HIDE_CSS_RULE = {
        selector: `input,.${HIDE_CLASSNAME},select,body *:before,body *:after`,
        style: 'opacity: 0 !important;'
    }

    const RESET_CSS_RULE = {
        selector: "body *,body,html",
        style: RESET_CSS.join(";")+";"
    }

    document.styleSheets[0].addRule(GRID_CSS_RULE.selector, GRID_CSS_RULE.style);
    document.styleSheets[0].addRule(HIDE_CSS_RULE.selector, HIDE_CSS_RULE.style);
    document.styleSheets[0].addRule(RESET_CSS_RULE.selector, RESET_CSS_RULE.style);

    const isVisibleNode = (node: TNode): number => {
        //@ts-ignore
        return ( !node.parentNode.tagName.match(/^(STYLE|SCRIPT|IFRAME|BODY)$/gi) );
    };

    const getSizeScale = (w: number,h: number) => {
        return (w*h) / (window.screen.width*window.screen.height)
    };

    const isImage = (node: TNode) => {
        return node.tagName == "IMG" || node.style.background.length > 1;
    };

    const isLarge = (node: TNode) => {
        if(!sizeThreshold) return true;
        const size = getSizeScale(node.offsetWidth, node.offsetHeight);
        return size >= sizeThreshold;
    };

    const isLong = (node: TNode) => {
        if(!textLength) return true;
        return node.innerHTML.length > textLength;
    };

    function resetTextNodes() {
        const tree = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {acceptNode: isVisibleNode},
            false
        );

        let node;
        while (node = tree.nextNode())
            if ( node && node.nodeValue!.trim().length > 0) {
                const wrapper = document.createElement('span');
                wrapper.className =  HIDE_CLASSNAME;
                wrapper.appendChild(node.parentNode!.replaceChild(wrapper, node));
            }
    }

    function resetImgNodes(){
        const filter = function(node: TNode): number{
            if( isImage(node) )
                return NodeFilter.FILTER_ACCEPT
            else
                return NodeFilter.FILTER_SKIP
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            {acceptNode: filter},
            false
        )

        while (walker.nextNode()) {
            //@ts-ignore
            walker.currentNode.src = "none"
            //@ts-ignore
            walker.currentNode.style.backgroundImage = "none"
            //@ts-ignore
            walker.currentNode.alt = ""
            //@ts-ignore
            walker.currentNode.className +=  ` ${HIDE_CLASSNAME}`;
        }
    }

    function drawGrid(){
        const filter = function(node: TNode): number{
            if(!isVisibleNode(node))return NodeFilter.FILTER_SKIP;

            const islarge = isLarge(node);
            const islong =  isLong(node);

            if((islarge && islong) || (isImage(node) && islarge)){
                return NodeFilter.FILTER_ACCEPT;
            }else{
                return NodeFilter.FILTER_SKIP;
            }
        }
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            {acceptNode: filter},
            false
        );

        while (walker.nextNode()) {
            //@ts-ignore
            walker.currentNode.className += ` ${GRID_CLASSNAME}`;
        }
    }

    resetTextNodes()
    drawGrid()
    resetImgNodes()
}