module.exports = function renderer() {

    var isLong;
    var isLarge;
    var isImage;
    var needTobeProcessTag;
    var textLength = 0;

    var temp = [];
    var detailFactor_char = 100; /*less more details, since this indicates minimum charectors*/
    var detailFactor_size = 5; /*0-5*/

    var getSizeFactor,
        extractFont,
        extractMeta;


    document.styleSheets[0].addRule(
        '.myclassisfuckuniqe_grid',

        'box-shadow: 0px 0px 0px 2px rgba(0,0,0,1) !important;',
        'opacity: 1 !important;'
    )

    document.styleSheets[0].addRule(
        'input,.myclassisfuckuniqe_hide,select,body *:before,body *:after',

        'opacity: 0 !important'
    )

    document.styleSheets[0].addRule(
        'body *, body, html',

        'background: rgba(0,0,0,0); !important;' +
        'background-image: none !important;' +
        'background-color: rgba(0,0,0,0) !important;' +
        'border: none !important;'
    )


    needTobeProcessTag = function (node) {
        return ( !node.parentNode.tagName.match(/^(STYLE|SCRIPT|IFRAME|BODY)$/gi) );
    };

    getSizeFactor = function(w,h){
        return (w*h*50) / (window.screen.width*window.screen.height)
    };

    isImage = function (node) {
        return node.tagName == "IMG" || node.style.background.length > 1;
    };

    isLarge = function (node) {
        var sizefactor = getSizeFactor(node.offsetWidth, node.offsetHeight);
        return sizefactor >= detailFactor_size;
    };
    isLong = function (node) {
        return node.innerHTML.length > detailFactor_char;
    };

    extractFont = function(){
        return document.defaultView
            .getComputedStyle(document.body, null)
            .getPropertyValue('font-family');
    };

    extractMeta = function(){
        var metas = document.getElementsByTagName('meta');

        var i = 0;
        var metaTag;
        var keywords = ""
        var description = "";
        var title = ""


        while( metaTag = metas[i] ){
            var tagNam = metaTag.name? metaTag.name.toLowerCase():"";
            var tagVal = metaTag.content? metaTag.content.toLowerCase():"";

            if( tagNam.indexOf('keywords') > -1 )
            {
                keywords = tagVal
            }

            else if( tagNam.indexOf('description') > -1 )
            {
                description = tagVal
            }

            else{
                i++;
            }
        }

        title =  document.title.toLowerCase();

        return {title: title, keywords: keywords, description: description}
    };

    function resetTextNodes() {
        var node, tree;

        tree = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {acceptNode: needTobeProcessTag},
            false
        );

        while (node = tree.nextNode())
            if ( node.nodeValue.trim().length > 0) {

                var wrapper = document.createElement('span');

                wrapper.className =  'myclassisfuckuniqe_hide';
                wrapper.appendChild(node.parentNode.replaceChild(wrapper, node));

            }
    }
    function resetImgNodes(){

        var filter = function(node){

            if( isImage(node) )
                return NodeFilter.FILTER_ACCEPT
            else
                return NodeFilter.FILTER_SKIP

        }

        var walker=document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            filter,
            false
        )

        while (walker.nextNode()) {
            walker.currentNode.src = "none"
            walker.currentNode.style.backgroundImage = "none"
            walker.currentNode.alt = ""
            walker.currentNode.className +=  ' myclassisfuckuniqe_hide';
        }
    }
    function drawGrid(){

        var filter =function(node){
            var islarge = isLarge(node)
            var islong =  isLong(node);

            if( islarge || islong
                || ( !isImage(node) && islarge && islong ) )

                return NodeFilter.FILTER_ACCEPT

            else
                return NodeFilter.FILTER_SKIP

        }

        var walker=document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            filter,
            false
        );


        while (walker.nextNode()) {
            walker.currentNode.className += ' myclassisfuckuniqe_grid';
        }
    }

    resetTextNodes()
    drawGrid()
    resetImgNodes()

    return {
        facts:[detailFactor_char,detailFactor_size],
        font: extractFont(),
        //meta: extractMeta(),
        debug: false
    }
};
