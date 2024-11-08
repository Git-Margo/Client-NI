let Templates = require('core/Templates');

module.exports = function() {

    let $table = null;
    let $scrollTablePlug;

    const init = ({
        $wrapper,
        $headerRecord,
        bodyRecordsArray,
        addClass,
        scrollMove
    }) => {
        init$table(addClass);
        init$tableHeader($headerRecord);
        initBodyRecords(bodyRecordsArray);
        initScrollBar(scrollMove);
        addPlugToScrollbar();

        $wrapper.append($table);
        updateScroll();
    };

    const addPlugToScrollbar = () => {
        $scrollTablePlug = $('<div>').addClass('scroll-table-plug');

        $($table).find('.table-with-static-header').append($scrollTablePlug);
    };

    const init$table = (addClass) => {
        $table = Templates.get('table-with-static-header');

        if (!addClass) {
            return
        }

        $table.addClass(addClass);
    };

    const init$tableHeader = ($headerRecord) => {
        $table.find('.table-with-static-header-header').append($headerRecord);
    };

    const initBodyRecords = (bodyRecordsArray) => {
        let $tableToAttachRecords = $table.find('.table-with-static-header-table');

        for (let i = 0; i < bodyRecordsArray.length; i++) {
            $tableToAttachRecords.append(bodyRecordsArray[i]);
        }
    };

    const scrollTop = () => {
        $('.scroll-wrapper', $table).trigger('scrollTop');
    };

    const updateScroll = () => {
        $('.scroll-wrapper', $table).trigger('update');
        let $tableWithStaticHeader = $($table).find('.table-with-static-header');

        $scrollTablePlug.height($tableWithStaticHeader.height() - 2);
    };

    const initScrollBar = (scrollMove) => {
        let config = {
            track: true,
            addScrollableClassToAnotherEl: $table.find('.table-with-static-header')
        };

        if (scrollMove) {
            config.callback = scrollMove;
        }

        $table.find('.scroll-wrapper').addScrollBar(config);
    };

    const getTable = () => {
        return $table;
    };

    const createRecords = (ob, addClass, callback) => {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);

            if (typeof addClass == 'object') $td.addClass(addClass[i]);
            else $td.addClass(addClass);

            recordCallback($td, callback, i);

            $tr.append($td);
        }
        return $tr;
    };

    function recordCallback($td, callback, i) {
        if (callback && callback[i]) $td.on('click', () => {
            callback[i]()
        });
    }

    this.init = init;
    this.scrollTop = scrollTop;
    this.updateScroll = updateScroll;
    this.getTable = getTable;
    this.createRecords = createRecords;

};