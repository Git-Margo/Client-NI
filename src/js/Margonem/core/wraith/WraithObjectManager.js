let WraithObject = require('@core/wraith/WraithObject');


module.exports = function() {
    let wraithObjectList;

    const init = () => {
        onClear();
    };

    const checkWraithObject = function(id) {
        return wraithObjectList[id] ? true : false;
    };

    const removeWraithObjectFromList = (id) => {
        delete wraithObjectList[id];
    };

    const addWraithObjectToList = (data, id) => {
        wraithObjectList[id] = data;
    };

    const removeWraithObject = (id) => {
        removeWraithObjectFromList(id);
    };

    const createWraithObject = (data) => {
        let wraith = new WraithObject();
        let id = data.id;

        wraith.init();

        addWraithObjectToList(wraith, id);
        wraith.updateData(data);
    };

    const update = (dt) => {
        //let notUpdate = Engine.opt(8);
        let notUpdate = !isSettingsOptionsInterfaceAnimationOn();
        for (var k in wraithObjectList) {
            if (notUpdate) {
                removeWraithObject(k);
                continue;
            }
            wraithObjectList[k].update(dt);
        }
    };

    const onClear = () => {
        wraithObjectList = {};
    };

    const getDrawableList = () => {
        let arr = [];
        for (let i in wraithObjectList) {
            arr.push(wraithObjectList[i]);
        }

        return arr;
    };

    this.init = init;
    this.createWraithObject = createWraithObject;
    this.removeWraithObject = removeWraithObject;
    this.checkWraithObject = checkWraithObject;
    this.getDrawableList = getDrawableList;
    this.onClear = onClear;
    this.update = update;

};