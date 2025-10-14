let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajProgrammerData = require('@core/raj/rajProgrammer/RajProgrammerData');

module.exports = function() {

    const moduleData = {
        fileName: "RajProgrammer.js"
    };

    let weekDays = null; //0: SUNDAY!!!!!!!!
    let specificDays = null;
    let normalDay = null;
    let loopperDay = null;
    let tickInterval = null;
    let time = null;
    let rajActionManager = null;
    let list = null;

    let loopperDayActive = null;
    let normalDayActive = null;
    let specificDaysActive = null;
    let weekDaysActive = null;

    const init = () => {
        resetData();
        initRajActionsManager();
        setTime(getTsInSecond());
        initTicInterval();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const WEEK_DAY = RajProgrammerData.WEEK_DAY;
        const NORMAL_DAY = RajProgrammerData.NORMAL_DAY;
        const SPECIFIC_DAY = RajProgrammerData.SPECIFIC_DAY;
        const LOOPPER = RajProgrammerData.LOOPPER;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkObjectExist,
                createRequire: {
                    start: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            time: {
                                specificFunc: checkCorrectTime
                            },
                            external_properties: {
                                type: TYPE.OBJECT
                            }
                        }
                    },
                    end: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            time: {
                                specificFunc: checkCorrectTime
                            },
                            external_properties: {
                                type: TYPE.OBJECT,
                                optional: true
                            }
                        }
                    },
                    name: {
                        conditionVal: {
                            [WEEK_DAY]: {
                                weekDay: {
                                    specificVal: [0, 1, 2, 3, 4, 5, 6]
                                }
                            },
                            [NORMAL_DAY]: {

                            },
                            [SPECIFIC_DAY]: {
                                specificDay: {
                                    specificFunc: checkCorrectDate
                                }
                            },
                            [LOOPPER]: {
                                duration: {
                                    specificFunc: checkCorrectTime
                                },
                                delay: {
                                    specificFunc: checkCorrectTime
                                }
                            }
                        }
                    }
                },
                createRequireFunc: (data) => {
                    return checkCorrectTimeOfStartAndEnd(data);
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID_NAME
        );
    };

    const resetData = () => {
        weekDays = {};
        specificDays = {};
        normalDay = {};
        loopperDay = {};

        list = {};

        loopperDayActive = {};
        normalDayActive = {};
        specificDaysActive = {};
        weekDaysActive = {};
    };

    const getFromList = (id) => {
        return list[id];
    };

    const addToList = (id, obj) => {
        list[id] = obj;
    };

    const checkObjectExist = (id) => {
        return list[id] ? true : false
    };

    const removeFromList = (id) => {
        delete list[id];
    };

    const clearTickInterval = () => {
        if (!tickInterval) return;

        clearInterval(tickInterval);
        tickInterval = null;
    };

    const initTicInterval = () => {
        tickInterval = setInterval(function() {
            tick();
        }, 10000);
    };

    const setTime = (_time) => {
        time = _time;
    };

    const getTsInSecond = () => {
        return Math.round(ts() / 1000);
    };

    const diffBetweenTimeAndActualTs = (actualTs) => {
        return actualTs - time;
    };

    const getTimeLabelFromTime = () => {
        return ut_time(time, true)
    };

    const getDateLabelFromTime = () => {
        return getCurrentDate({
            day: true,
            month: true
        })
    };

    const getWeekDayLabelFromTime = () => {
        return getStartWeekDay(time);
    };

    const tick = () => {
        let actualTs = getTsInSecond();
        let diff = diffBetweenTimeAndActualTs(actualTs);

        for (let i = 0; i < diff; i++) {
            setTime(time + 1);
            callByTimeLabel();
        }

        setTime(actualTs);
    };

    const callByTimeLabel = () => {
        let timeLabel = getTimeLabelFromTime();
        let dateLabel = getDateLabelFromTime();
        let weekDayLabel = getWeekDayLabelFromTime();

        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        manageLoopperDay(timeLabel, END, false);
        manageLoopperDay(timeLabel, START, true);
        manageNormalDay(timeLabel, END, false);
        manageNormalDay(timeLabel, START, true);
        mananageSpecificDays(dateLabel, END, timeLabel, false);
        mananageSpecificDays(dateLabel, START, timeLabel, true);
        mananageWeekDays(weekDayLabel, END, timeLabel, false);
        mananageWeekDays(weekDayLabel, START, timeLabel, true);
    };

    const manageLoopperDay = (timeLabel, kind, state) => {
        if (loopperDay[kind] && loopperDay[kind][timeLabel]) {
            let srajData = loopperDay[kind][timeLabel];

            const LOOPPER = RajProgrammerData.LOOPPER;
            //devConsoleLog(['loopperDay', srajData]);

            setActiveEventWithEndInLoop(srajData, state, LOOPPER);
            serverRayControllerData(srajData)
        }
    };

    const manageNormalDay = (timeLabel, kind, state) => {
        if (normalDay[kind] && normalDay[kind][timeLabel]) {
            let srajData = normalDay[kind][timeLabel];

            const NORMAL_DAY = RajProgrammerData.NORMAL_DAY;
            //devConsoleLog(['normalDay', srajData]);

            setActiveEventWithEndInLoop(srajData, state, NORMAL_DAY);
            serverRayControllerData(srajData)
        }
    };

    const mananageSpecificDays = (dateLabel, kind, timeLabel, state) => {
        if (specificDays[dateLabel] && specificDays[dateLabel][kind][timeLabel]) {
            let srajData = specificDays[dateLabel][kind][timeLabel];

            const SPECIFIC_DAY = RajProgrammerData.SPECIFIC_DAY;
            //devConsoleLog(['specificDays', srajData]);

            setActiveEventWithEndInLoop(srajData, state, SPECIFIC_DAY);
            serverRayControllerData(srajData)
        }
    };

    const mananageWeekDays = (weekDayLabel, kind, timeLabel, state) => {
        if (weekDays[weekDayLabel] && weekDays[weekDayLabel][kind][timeLabel]) {
            let srajData = weekDays[weekDayLabel][kind][timeLabel];

            const WEEK_DAY = RajProgrammerData.WEEK_DAY;
            if (getDebug(CFG.DEBUG_KEYS.SRAJ)) {
                devConsoleLog(['callWeekDaysProgrammer', srajData])
            }

            setActiveEventWithEndInLoop(srajData, state, WEEK_DAY);
            serverRayControllerData(srajData)
        }
    };

    const updateData = (v, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(v, additionalData)) return;

        for (let i = 0; i < v.list.length; i++) {
            let oneEvent = v.list[i];

            rajActionManager.updateData(oneEvent, additionalData);
        }
    };


    const createAction = (data, additionalData) => {
        let WEEK_DAY = RajProgrammerData.WEEK_DAY;
        let NORMAL_DAY = RajProgrammerData.NORMAL_DAY;
        let SPECIFIC_DAY = RajProgrammerData.SPECIFIC_DAY;
        let LOOPPER = RajProgrammerData.LOOPPER;

        let actualSecondPass = getActualSecondPass();

        switch (data.name) {
            case WEEK_DAY:
                createOneEventWeekDays(data);

                let actualWeekDay = getWeekDayLabelFromTime();
                if (data.weekDay != actualWeekDay) return;
                checkAndCallExpireEvents(data, actualSecondPass, WEEK_DAY);
                break;
            case NORMAL_DAY:
                createOneEventNormalDay(data);

                checkAndCallExpireEvents(data, actualSecondPass, NORMAL_DAY);
                break;
            case SPECIFIC_DAY:
                createOneEventSpecificDays(data);

                let dataLabel = getDateLabelFromTime();
                if (data.specificDay != dataLabel) return;
                checkAndCallExpireEvents(data, actualSecondPass, SPECIFIC_DAY);
                break;
            case LOOPPER:
                let parseHelpLoopperDayData = getLoopperEvents(data);
                for (let i = 0; i < parseHelpLoopperDayData.length; i++) {
                    createOneEventLopper(parseHelpLoopperDayData[i]);
                }

                for (let i in parseHelpLoopperDayData) {
                    let oneEvent = parseHelpLoopperDayData[i];
                    checkAndCallExpireEvents(oneEvent, actualSecondPass, LOOPPER);
                }
                break;
        }
    }

    const removeAction = (data, additionalData) => {
        let id = data.id;

        if (!checkObjectExist(id)) return;

        const WEEK_DAY = RajProgrammerData.WEEK_DAY;
        const SPECIFIC_DAY = RajProgrammerData.SPECIFIC_DAY;
        const NORMAL_DAY = RajProgrammerData.NORMAL_DAY;
        const LOOPPER = RajProgrammerData.LOOPPER;

        let oneListElement = getFromList(id);

        switch (oneListElement.name) {
            case WEEK_DAY:
                removeFromWeekDays(id);
                break;
            case SPECIFIC_DAY:
                removeFromSpecificDays(id);
                break;
            case NORMAL_DAY:
                removeFromNormalDay(id);
                break;
            case LOOPPER:
                removeFromLoopperDay(id);
                break;
        }

        removeFromList(id);

    };

    const removeFromLoopperDay = (id) => {

        const LOOPPER = RajProgrammerData.LOOPPER;
        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        let start = loopperDay[START];
        let end = loopperDay[END];

        if (loopperDayActive[id]) {
            let data = getDataFromHelpId(loopperDayActive[id].helpId);
            let oneDataLabelArray = loopperDay[END][data.endTime]

            let oneEvent;

            for (let i = 0; i < oneDataLabelArray.length; i++) {
                if (oneDataLabelArray[i].id == data.id) {
                    oneEvent = oneDataLabelArray[i];
                    break;
                }
            }
            setActiveEventWithEnd(oneEvent, false, LOOPPER);
            serverRayControllerData([oneEvent]);
        }

        deleteFromStartAndEndInLoopper(id, start, end);

    }

    const removeFromWeekDays = (id) => {
        const WEEK_DAY = RajProgrammerData.WEEK_DAY;
        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        let actualWeekDay = getWeekDayLabelFromTime();

        for (let weekDayIndex in weekDays) {
            let start = weekDays[weekDayIndex][START];
            let end = weekDays[weekDayIndex][END];

            let callSrajEndData = actualWeekDay == weekDayIndex;

            deleteFromStartAndEnd(id, start, end, callSrajEndData, WEEK_DAY);

        }

    };

    const removeFromSpecificDays = (id) => {
        const SPECIFIC_DAY = RajProgrammerData.SPECIFIC_DAY;
        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        let actualDataLabel = getDateLabelFromTime();

        for (let specificDay in specificDays) {
            let start = specificDays[specificDay][START];
            let end = specificDays[specificDay][END];

            let callSrajEndData = actualDataLabel == specificDay;

            deleteFromStartAndEnd(id, start, end, callSrajEndData, SPECIFIC_DAY);
        }

    };

    const removeFromNormalDay = (id) => {
        const NORMAL_DAY = RajProgrammerData.NORMAL_DAY;
        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        let start = normalDay[START];
        let end = normalDay[END];

        deleteFromStartAndEnd(id, start, end, true, NORMAL_DAY);
    };

    const deleteFromStartAndEndInLoopper = (id, start, end) => {

        let startObjectToRemove;
        let endObjectToRemove;

        for (let dataLabelStart in start) {
            let oneDataLabelArray = start[dataLabelStart];

            startObjectToRemove = getObjectFromArray(id, oneDataLabelArray, dataLabelStart);
            if (startObjectToRemove) {
                deleteElementFromArray(startObjectToRemove.i, oneDataLabelArray);
            }
        }

        for (let dataLabelEnd in end) {
            let oneDataLabelArray = end[dataLabelEnd];

            endObjectToRemove = getObjectFromArray(id, oneDataLabelArray, dataLabelEnd);
            if (endObjectToRemove) {
                deleteElementFromArray(endObjectToRemove.i, oneDataLabelArray);
            }
        }
    };

    const deleteFromStartAndEnd = (id, start, end, callSrajEndData, kind) => {

        let startObjectToRemove;
        let endObjectToRemove;

        for (let dataLabelStart in start) {
            let oneDataLabelArray = start[dataLabelStart];

            startObjectToRemove = getObjectFromArray(id, oneDataLabelArray, dataLabelStart);
            if (startObjectToRemove) {
                deleteElementFromArray(startObjectToRemove.i, oneDataLabelArray);
                break;
            }
        }

        for (let dataLabelEnd in end) {
            let oneDataLabelArray = end[dataLabelEnd];

            endObjectToRemove = getObjectFromArray(id, oneDataLabelArray, dataLabelEnd);
            if (endObjectToRemove) {
                deleteElementFromArray(endObjectToRemove.i, oneDataLabelArray);
                break;
            }
        }

        if (!callSrajEndData) {
            return;
        }

        if (startObjectToRemove && endObjectToRemove) {
            manageEndOfEventAfterRemove(startObjectToRemove, endObjectToRemove, kind);
        }
    };

    const manageEndOfEventAfterRemove = (startObjectToRemove, endObjectToRemove, kind) => {

        let start_external_properties = startObjectToRemove.obj.srajData;
        let end_external_properties = endObjectToRemove.obj.srajData;

        if (start_external_properties == null && end_external_properties == null) {
            return;
        }

        let obj = {
            start: {
                time: startObjectToRemove.time
            },
            end: {
                time: endObjectToRemove.time
            }
        };

        let actualSecondPass = getActualSecondPass();

        let inProgress = checkEventTimeIsInProgress(obj, actualSecondPass);

        if (!inProgress) return;

        setActiveEventWithEnd(endObjectToRemove.obj, false, kind);
        serverRayControllerData([endObjectToRemove.obj]);
    };

    const getObjectFromArray = (id, oneDataLabelArray, time) => {
        for (let i = 0; i < oneDataLabelArray.length; i++) {
            if (oneDataLabelArray[i].id == id) {
                return {
                    i: i,
                    obj: oneDataLabelArray[i],
                    time: time
                };
            }
        }

        return null;
    };

    const getLoopperEvents = (oneData) => {
        let eventsList = [];
        let loopStart = oneData.start.time;
        let loopEnd = oneData.end.time;

        let loopSecondsStart = countSeconds(loopStart);
        let loopSecondsEnd = countSeconds(loopEnd);
        let startData = oneData.start.external_properties;
        let endData = oneData.end.external_properties ? oneData.end.external_properties : null;

        let id = oneData.id;
        let name = oneData.name;

        addToList(id, oneData);

        let timeZoneSecondOffset = new Date(0).getTimezoneOffset() * 60;

        let cycleSecondsDuration = countSeconds(oneData.duration);
        let cycleSecondsDelay = countSeconds(oneData.delay);

        let actualSeconds = loopSecondsStart;


        while (actualSeconds < loopSecondsEnd && actualSeconds + cycleSecondsDuration < loopSecondsEnd) {

            let startTimeSeconds = actualSeconds + timeZoneSecondOffset;
            let endTimeSeconds = actualSeconds + timeZoneSecondOffset + cycleSecondsDuration;

            let startLabel = ut_time(startTimeSeconds, true);
            let endLabel = ut_time(endTimeSeconds, true);
            let o = {
                id: id,
                name: name,
                start: {
                    startTimeSeconds: actualSeconds,
                    time: startLabel,
                    external_properties: startData
                },
                end: {
                    endTimeSeconds: actualSeconds + cycleSecondsDuration,
                    time: endLabel
                }
            };

            if (endData) o.end.external_properties = endData;

            eventsList.push(o);

            actualSeconds += cycleSecondsDelay;
        }

        return eventsList;
    };

    const getActualSecondPass = () => {
        let date = new Date();
        return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    };

    const checkAndCallExpireEvents = (oneEvent, actualSecondPass, kind) => {
        let inProgress = checkEventTimeIsInProgress(oneEvent, actualSecondPass);

        if (!inProgress) return;

        let id = oneEvent.id;

        let o = {
            id: id,
            srajData: oneEvent.start.external_properties
        };

        if (oneEvent.end.external_properties) {
            o.endExist = true;

            if (kind == RajProgrammerData.LOOPPER) {
                o.helpId = getHelpId(id, oneEvent.end.time);
            }
        }

        setActiveEventWithEnd(o, true, kind);
        serverRayControllerData([o]);
    };

    const checkEventTimeIsInProgress = (oneEvent, actualSecondPass) => {
        let startTimeSecond; // = countSeconds(oneEvent.start.time);
        let endTimeSecond; //   = countSeconds(oneEvent.end.time);

        if (oneEvent.start.startTimeSeconds && oneEvent.end.endTimeSeconds) {
            startTimeSecond = oneEvent.start.startTimeSeconds;
            endTimeSecond = oneEvent.end.endTimeSeconds;
        } else {
            startTimeSecond = countSeconds(oneEvent.start.time);
            endTimeSecond = countSeconds(oneEvent.end.time);
        }

        return startTimeSecond < actualSecondPass && actualSecondPass < endTimeSecond;
    };

    const createOneEventNormalDay = (oneEvent) => {
        let startTime = oneEvent.start.time;
        let endTime = oneEvent.end.time;

        let startRajData = oneEvent.start.external_properties;
        let endRajData = oneEvent.end.external_properties;

        let id = oneEvent.id;

        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        addToList(id, oneEvent);

        if (checkObjectIsEmpty(normalDay)) normalDay = {
            [START]: {},
            [END]: {}
        };

        let daysStart = normalDay[START];
        let daysEnd = normalDay[END];

        let o = {
            id: id,
            srajData: startRajData,
            endExist: false
        };

        if (!daysStart[startTime]) daysStart[startTime] = [];
        daysStart[startTime].push(o);

        if (!endRajData || endRajData && checkObjectIsEmpty(endRajData)) return;

        o.endExist = true;

        if (!daysEnd[endTime]) daysEnd[endTime] = [];
        daysEnd[endTime].push({
            id: id,
            srajData: endRajData
        });
    };

    const createOneEventLopper = (oneEvent) => {
        let startTime = oneEvent.start.time;
        let endTime = oneEvent.end.time;

        let startTimeSeconds = oneEvent.start.startTimeSeconds;
        let endTimeSeconds = oneEvent.end.endTimeSeconds;

        let startRajData = oneEvent.start.external_properties;
        let endRajData = oneEvent.end.external_properties;

        let id = oneEvent.id;

        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        //addToList(id, oneEvent);

        if (checkObjectIsEmpty(loopperDay)) loopperDay = {
            [START]: {},
            [END]: {}
        };

        let daysStart = loopperDay[START];
        let daysEnd = loopperDay[END];

        if (!daysStart[startTime]) daysStart[startTime] = [];
        let o = {
            id: id,
            srajData: startRajData,
            startTimeSeconds: startTimeSeconds,
            endExist: false
        }

        daysStart[startTime].push(o);

        if (!endRajData || endRajData && checkObjectIsEmpty(endRajData)) {
            return;
        }

        o.endExist = getHelpId(id, endTime); //id + "-" +  endTime;
        o.helpId = getHelpId(id, endTime); //id + "-" +  endTime;

        if (!daysEnd[endTime]) daysEnd[endTime] = [];
        daysEnd[endTime].push({
            id: id,
            helpId: getHelpId(id, endTime),
            srajData: endRajData,
            endTimeSeconds: endTimeSeconds
        });
    };

    const getHelpId = (id, endTime) => {
        return id + "-" + endTime;
    };

    const getDataFromHelpId = (helpId) => {
        let data = helpId.split("-");

        if (data.length != 2) {
            errorReport(moduleData.fileName, "getDataFromHelpId", "BUG");
            return {
                id: 0,
                endTime: "00:00:00"
            }
        }

        return {
            id: data[0],
            endTime: data[1]
        }
    };

    const createOneEventSpecificDays = (oneEvent) => {
        let startTime = oneEvent.start.time;
        let endTime = oneEvent.end.time;

        let startRajData = oneEvent.start.external_properties;
        let endRajData = oneEvent.end.external_properties;

        let specificDay = oneEvent.specificDay;
        let id = oneEvent.id;

        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        addToList(id, oneEvent);

        if (!specificDays[specificDay]) specificDays[specificDay] = {
            [START]: {},
            [END]: {}
        };

        let daysStart = specificDays[specificDay][START];
        let daysEnd = specificDays[specificDay][END];

        let o = {
            id: id,
            srajData: startRajData,
            endExist: false
        };

        if (!daysStart[startTime]) daysStart[startTime] = [];
        daysStart[startTime].push(o);

        if (!endRajData || endRajData && checkObjectIsEmpty(endRajData)) {
            return;
        }

        o.endExist = true;

        if (!daysEnd[endTime]) daysEnd[endTime] = [];
        daysEnd[endTime].push({
            id: id,
            srajData: endRajData
        });
    };

    const createOneEventWeekDays = (oneEvent) => {
        let startTime = oneEvent.start.time;
        let endTime = oneEvent.end.time;

        let startRajData = oneEvent.start.external_properties;
        let endRajData = oneEvent.end.external_properties;

        let weekDayIndex = oneEvent.weekDay;
        let id = oneEvent.id;

        const END = RajProgrammerData.END;
        const START = RajProgrammerData.START;

        addToList(id, oneEvent);

        if (!weekDays[weekDayIndex]) weekDays[weekDayIndex] = {
            [START]: {},
            [END]: {}
        };

        let weekDaysStart = weekDays[weekDayIndex][START];
        let weekDaysEnd = weekDays[weekDayIndex][END];

        if (!weekDaysStart[startTime]) weekDaysStart[startTime] = [];

        let o = {
            id: id,
            srajData: startRajData,
            endExist: false
        }

        weekDaysStart[startTime].push(o);

        if (!endRajData || endRajData && checkObjectIsEmpty(endRajData)) {
            return;
        }

        o.endExist = true;

        if (!weekDaysEnd[endTime]) weekDaysEnd[endTime] = [];
        weekDaysEnd[endTime].push({
            id: id,
            srajData: endRajData
        });
    };

    const serverRayControllerData = (data) => {
        for (let k in data) {
            Engine.rajController.parseObject(data[k].srajData, false, {
                module: moduleData.fileName
            });
        }
    };

    const setActiveEventWithEndInLoop = (events, state, WEEK_DAY) => {
        for (let i = 0; i < events.length; i++) {
            setActiveEventWithEnd(events[i], state, WEEK_DAY);
        }
    };

    const setActiveEventWithEnd = (oneEvent, state, kind) => {
        const LOOPPER = RajProgrammerData.LOOPPER;
        const WEEK_DAY = RajProgrammerData.WEEK_DAY;
        const SPECIFIC_DAY = RajProgrammerData.SPECIFIC_DAY;
        const NORMAL_DAY = RajProgrammerData.NORMAL_DAY;

        if (state == true && !oneEvent.endExist) return; // event without end not collect

        const id = oneEvent.id;
        const helpId = isset(oneEvent.helpId) ? oneEvent.helpId : null;

        let obj = null;

        switch (kind) {
            case LOOPPER:
                obj = loopperDayActive;
                break;
            case WEEK_DAY:
                obj = weekDaysActive;
                break;
            case SPECIFIC_DAY:
                obj = specificDaysActive;
                break;
            case NORMAL_DAY:
                obj = normalDayActive;
                break;
            default:
                errorReport(moduleData.fileName, "setActiveEventWithEnd", `kind ${kind} not eixst!`);
                return;
        }

        if (state) obj[id] = helpId == null ? true : {
            helpId: helpId
        };
        else delete obj[id];
    };

    const checkCorrectDate = (dateKey) => {
        const FUNC = "checkCorrectDate";
        let splitData = dateKey.split("."); // 15.02

        let correctDate = splitData.length == 2;

        if (!correctDate) {
            errorReport(moduleData.fileName, FUNC, "Incorrect date format! Need DD.MM !", dateKey);
            return false;
        }

        let correctNumbers = isNumberFunc(splitData[0]) && isNumberFunc(splitData[1]);

        if (!correctNumbers) {
            errorReport(moduleData.fileName, FUNC, "Incorrect date format! ONLY numbers PLEASE!!", dateKey);
            return false;
        }

        return true;
    };

    const checkCorrectTime = (timeKey) => {

        const FUNC = "checkCorrectTime";
        let splitData = timeKey.split(":"); // 12:00:30

        let correctData = splitData.length == 3;

        if (!correctData) {
            errorReport(moduleData.fileName, FUNC, "Incorrect time format! Need HH:MM:SS !", timeKey);
            return false;
        }

        let correctNumbers = isNumberFunc(splitData[0]) && isNumberFunc(splitData[1]) && isNumberFunc(splitData[2]);

        if (!correctNumbers) {
            errorReport(moduleData.fileName, FUNC, "Incorrect time format! ONLY numbers PLEASE!!", timeKey);
            return false;
        }

        if (splitData[0] > 23 || splitData[1] > 59 || splitData[2] > 59) {
            errorReport(moduleData.fileName, FUNC, "Crazy time! Correct PLEASE!!", timeKey);
            return false;
        }

        return true;
    };

    const checkCorrectTimeOfStartAndEnd = (data) => {
        let startTimeSecond = countSeconds(data.start.time);
        let endTimeSecond = countSeconds(data.end.time);

        if (endTimeSecond < startTimeSecond) {
            errorReport(moduleData.fileName, 'checkCorrectOneEvent", "oneEvent.end.time must be declared late than oneEvent.start.time !!', data);
            return false
        }

        return true;
    };

    const countSeconds = (timeLabel) => {
        let splitTime = timeLabel.split(":");

        return parseInt(splitTime[0]) * 3600 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2]);
    };

    //const getTime = () => {
    //    return time;
    //};

    const onClear = () => {
        resetData();
    };

    const getActiveEvents = () => {
        return {
            loopperDayActive: loopperDayActive,
            normalDayActive: normalDayActive,
            specificDaysActive: specificDaysActive,
            weekDaysActive: weekDaysActive
        }
    }

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
    //this.getActiveEvents    = getActiveEvents;


};