const phantom = require('phantom');
const render = require('./lib/renderer');

var sitepage = null;
var phInstance = null;

const configs = {
    VIEW_WIDTH: 1440,
    VIEW_HEIGHT: 960,
    FILE_FORMAT: 'png'
}

const url = process.argv[2];
const filename = new Date().getTime();

phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {

        page.property('viewportSize', { width: configs.VIEW_WIDTH, height: configs.VIEW_HEIGHT},function(result) {
            console.log("Viewport set to: " + result.width + "x" + result.height)
        });

        sitepage = page;
        return page.open(url);
    })
    .then(status => {
        console.log('page is open');
        return saveNormalView();
    })
    .then(normal_rendered => {
        console.log('normal_rendered',normal_rendered);

        sitepage
            .invokeMethod('evaluate',render)
            .then(function(data) {
                saveGridView();
                sitepage.close();
                phInstance.exit();
            });

    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });


function saveNormalView() {
    return sitepage.render(filename+"-normal"+'.'+configs.FILE_FORMAT);
}

function saveGridView() {
    return sitepage.render(filename+"-grid"+'.'+configs.FILE_FORMAT);
}
