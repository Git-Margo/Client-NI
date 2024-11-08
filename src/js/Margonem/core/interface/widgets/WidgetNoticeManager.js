module.exports = function() {

    let data = null;
    let allPossibleNoticeName = null;

    const init = () => {
        data = [];
        allPossibleNoticeName = [
            Engine.widgetsData.notice.NEWS.nameNotice,
            Engine.widgetsData.notice.REWARDS_CALENDAR.nameNotice
        ];
    };

    const setData = (_data) => {
        data = _data;
    };

    const getData = () => {
        return data;
    };

    const forceUpdate = () => {
        update(data);
    };

    const update = (v) => {
        setData(v);

        if (!Engine.widgetManager.getWidgetLoaded()) return;
        if (!data.length) return;

        for (let i in allPossibleNoticeName) {
            let typeRewardCalendar;
            let nameNotice = allPossibleNoticeName[i];
            let noticeExist = checkNoticeExistByNameNotice(nameNotice);

            if (noticeExist) {
                //removeFromDataByNameNotice(nameNotice);
                typeRewardCalendar = Engine.widgetsData.type.BLINK_VIOLET;
            } else {
                typeRewardCalendar = Engine.widgetsData.type.VIOLET;
            }

            let widgetName = getWidgetNameFromWidgetNoticeName(nameNotice);

            if (widgetName == null) return;

            Engine.widgetManager.updateOneWidgetNoticeProcedure(widgetName, typeRewardCalendar)

        }
    };

    const getNoticeObjectByNameNotice = (nameNotice) => {
        for (let k in Engine.widgetsData.notice) {
            if (Engine.widgetsData.notice[k].nameNotice == nameNotice) {
                return Engine.widgetsData.notice[k];
            }
        }

        return null;
    };

    const getNoticeObjectByNameWidget = (nameWidget) => {
        for (let k in Engine.widgetsData.notice) {
            if (Engine.widgetsData.notice[k].nameWidget == nameWidget) {
                return Engine.widgetsData.notice[k];
            }
        }

        return null;
    };

    const getWidgetNameFromWidgetNoticeName = (nameNotice) => {
        let noticeObj = getNoticeObjectByNameNotice(nameNotice);

        if (noticeObj == null) {
            errorReport('WidgetNoticeManager.js', 'getWidgetNameFromWidgetNoticeName', '');
            return null;
        }

        let nameWidget = noticeObj.nameWidget;

        //return Engine.widgetsData.name[nameWidget];
        return nameWidget;
    };

    //const checkAlwaysAvailableByNoticeName = (nameNotice) => {
    //    let noticeObj = getNoticeObjectByNameNotice(nameNotice);
    //
    //    if (!isset(noticeObj.alwaysAvailable)) return true;
    //
    //    return noticeObj.alwaysAvailable;
    //};

    const checkAlwaysAvailableByWidgetName = (nameWidget) => {
        let noticeObject = getNoticeObjectByNameWidget(nameWidget);

        if (noticeObject == null) {
            errorReport('WidgetNoticeManager.js', 'checkAlwaysAvailableByWidgetName', `Notice object not found by nameWidget: ${nameWidget}`, Engine.widgetData.notice);
            return false
        }

        if (!isset(noticeObject.alwaysAvailable)) return true;

        return noticeObject.alwaysAvailable;
    };

    //const checkNoticeExistByNameNotice = (widgetNoticeName) => {
    //    switch (widgetNoticeName) {
    //        case Engine.widgetsData.notice.NEWS.nameNotice:              return isNewsNoticeExist();
    //        case Engine.widgetsData.notice.REWARDS_CALENDAR.nameNotice:  return isRewardCalendarNoticeExist();
    //        default:
    //            errorReport('WidgetNoticeManager.js', "checkNoticeExistByName", 'Undefined notice: ' + widgetNoticeName, Engine.widgetsData.notice);
    //            return false;
    //    }
    //};

    const checkNoticeExistByNameNotice = (widgetNoticeName) => {
        return data.indexOf(widgetNoticeName) > -1;
    };

    const removeFromDataByNameNotice = (id) => {
        for (let k in data) {
            if (data[k] == id) {
                data.splice(k, 1);
                return
            }
        }
        errorReport('WidgetNoticeManager', 'removeFromDataByNameNotice', `id ${id} not exist`, data);
    };
    /*
        const isRewardCalendarNoticeExist = () => {

            let REWARDS_CALENDAR    = Engine.widgetsData.name.REWARDS_CALENDAR;

            if (data.indexOf(Engine.widgetsData.notice.REWARDS_CALENDAR.nameNotice) > -1) {

                let isAttachToWidgetList = Engine.widgetManager.checkAttachWidgetList(REWARDS_CALENDAR);
                if (!isAttachToWidgetList) {
                    warningReport("NoticeManager.js", "update", "REWARDS_CALENDAR not attach to widget list!")
                    return false;
                }

                // if (en) Engine.interface.clickRewardsCalendar();
                // else {
                //     //Engine.widgetManager.setTypeInDefaultWidgetSet(REWARDS_CALENDAR, BLINK_VIOLET)
                //     return true;
                // }

                return true;

            } else return false;
        };

        const isNewsNoticeExist = () => {
            let en = isEn();
            if (en) return false

            let NEWS                = Engine.widgetsData.name.NEWS;

            let isAttachToWidgetList = Engine.widgetManager.checkAttachWidgetList(NEWS);

            if (!isAttachToWidgetList) {
                warningReport("NoticeManager.js", "update", "NEWS not attach to widget list!")
                return false;
            }

            let result = data.indexOf(Engine.widgetsData.notice.NEWS.nameNotice) > -1;

            // if (data.indexOf(WidgetNoticeData.NEWS_NOTICE) > -1)    result  = true
            // else                                                    result  = false

            //Engine.widgetManager.setTypeInDefaultWidgetSet(NEWS, type);
            return result;
        };
    */
    this.init = init;
    this.getData = getData;
    this.update = update;
    this.checkAlwaysAvailableByWidgetName = checkAlwaysAvailableByWidgetName;
    this.forceUpdate = forceUpdate;


};