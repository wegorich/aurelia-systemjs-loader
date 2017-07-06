
exports.translate = function (load) {
    // TODO: add some event emitter to say new module there
    console.log('module loads', load.name);
    return load;
}