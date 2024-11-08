const Templates = require('../Templates');

module.exports = function() {

    let $build;
    let name;
    let id;

    const init = (data) => {
        createBuild(data);
    }

    const createBuild = (data) => {
        $build = Templates.get("one-handheld-build");
        id = data.id;

        $build.find(".build-index").html(parseInt(id));

        $build.on('click', function() {
            clickBuild();
        });
    };

    const clickBuild = () => {
        getEngine().buildsManager.getBuildsRequests().setCurrentBuildId(id);
    };

    const update = (data) => {
        if (isset(data.name)) {
            updateNameBuild(data);
        }
    }

    const updateNameBuild = (data) => {
        name = data.name;

        $build.tip(getEngine().buildsManager.changeDefaultNameIfExist(name));
    };

    const get$build = () => {
        return $build;
    }

    this.init = init;
    this.update = update;
    this.get$build = get$build;

}