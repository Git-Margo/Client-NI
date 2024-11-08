const {
    copyToClipboard
} = require('../../HelpersTS');
const Checkbox = require('../../components/Checkbox');
const Button = require('../../components/Button');
const ServerStorageData = require('../../storage/ServerStorageData');
const ChatData = require('core/chat/ChatData');
module.exports = function() {

    const
        addonKey = Engine.windowsData.name.addon_24,
        addonName = getText('heros-detector');

    var running = false;
    var detectedHeroes = [];
    //var last = 0;
    var optionsWnd = null;
    let data = null;
    let tempData = null;

    const specialNpcForPL = [
        170014, 173615, 182963, 190415, 190417, 190420, 190421, 190422, 190423, 190424, 190425, 190426, 190428, 190429, 190430, 190431, 190432, 190433, 190434, 190435, 190436,
        215338, 215339, 215340, 215341, 215342, 215343, 215344, 215345, 215346, 215347, 215347, 215349, 215350, 215351, 215352, 215353, 215354, 215355, 215356, 215359, 266720,
        250068, 250069, 250070, 250071, 250072, 250073, 250074, 250075, 250076, 250077,
        282581, 282583, 282584, 282585, 282586, 282587, 282588, 282589, 282590, 282591,
        289062, 289063, 289064, 289065, 289066, 289067, 289068, 289069, 289070, 289071, 289072, 289073, 289074, 289075, 289076, 289077, 289078, 289079, 289080, 289081,
        236992, 295610, 295611, 295612, 295613, 295614, 295615, 295616, 295617, 295618, 295619, 295620,
        308322, 308323, 308324, 308345, 304710, 304711, 304712, 304713, 304714, 304715, 304716, 304717
    ];
    const specialNpcForCom = [
        154933, 154934, 154935, 154936, 154937, 154938, 154939, 154940, 154941, 154942
    ];

    const T = {
        HEROES: 'HEROES',
        EVENT_HEROES: 'EVENT_HEROES',
        TITANS: 'TITANS',
        COLOSSUS: 'COLOSSUS',
        SPECIAL_NPC: 'SPECIAL_NPC',
        ALCHEMIST_BAGS: 'ALCHEMIST_BAGS',
        RESOURCES: 'RESOURCES',
    }

    const defaultSettings = {
        [T.HEROES]: {
            checked: true
        },
        [T.TITANS]: {
            checked: true
        },
        [T.COLOSSUS]: {
            checked: true
        },
        [T.SPECIAL_NPC]: {
            checked: true
        },
        [T.ALCHEMIST_BAGS]: {
            checked: true
        },
        [T.RESOURCES]: {
            checked: true
        },
    }

    const types = {
        [T.HEROES]: {
            name: getText('heros'),
            showNameInMessage: true,
            canFindGroup: true
        },
        [T.EVENT_HEROES]: {
            name: getText('heros'),
            showNameInMessage: true,
            canFindGroup: true,
        },
        [T.TITANS]: {
            name: getText('titan'),
            showNameInMessage: true,
            canFindGroup: true
        },
        [T.COLOSSUS]: {
            name: getText('colossus'),
            showNameInMessage: true,
            canFindGroup: true
        },
        [T.SPECIAL_NPC]: {
            name: getText('special-npc'),
            showNameInMessage: false,
            canFindGroup: true,
            idsPl: specialNpcForPL,
            idsCom: [
                ...(Engine.worldConfig.getWorldName() === 'beluga' ? specialNpcForPL : specialNpcForCom)
            ]
        },
        [T.ALCHEMIST_BAGS]: {
            name: getText('alchemist-bag'),
            showNameInMessage: false,
            canFindGroup: false,
            ids: [192201, 192202, 192203, 192204, 192205, 192206]
        },
        [T.RESOURCES]: {
            name: getText('resources'),
            showNameInMessage: false,
            canFindGroup: false,
            ids: [69871]
        },
    }

    function getData() {
        const storageData = Engine.serverStorage.get(ServerStorageData.ADDON_24);
        return storageData ? {
            ...defaultSettings,
            ...storageData.data
        } : defaultSettings;
    }

    function saveData() {
        Engine.serverStorage.sendData({
            [ServerStorageData.ADDON_24]: {
                data: tempData
            }
        }, () => {
            data = JSON.parse(JSON.stringify(tempData));
            setInitialData();
        });
    }

    function getLabel(key) {
        return types[key].name;
    }

    function setContent() {

        createSaveBtn();
    }

    function setInitialData() {
        const d = getData();
        data = JSON.parse(JSON.stringify(d));
        tempData = JSON.parse(JSON.stringify(d));
    }

    function createSaveBtn() {
        const buttonsContainerEl = optionsWnd.el.querySelector('.btns-container');
        const buttonOptions = [{
            text: _t('save', null, 'buttons'),
            classes: ['small', 'green'],
            action: () => onClickSave()
        }, ];

        for (const options of buttonOptions) {
            const button = new Button.default(options).getButton();
            buttonsContainerEl.appendChild(button);
        }
    }

    function onClickSave() {
        saveData();
        close();
    }

    function setCheckboxes() {
        for (const key in tempData) {
            const {
                checked
            } = tempData[key];
            const checkboxContainerEl = optionsWnd.el.querySelector(`.checkboxes`);
            const label = getLabel(key);
            const checkbox = new Checkbox.default({
                    name: `npc_${key}`,
                    label,
                    value: key,
                    i: key,
                    checked,
                },
                (state) => onSelected(state, key),
            ).getCheckbox();
            checkboxContainerEl.appendChild(checkbox);
        }
    }

    function onSelected(state, key) {
        tempData[key].checked = state;
    }

    function clearCheckboxes() {
        optionsWnd.el.querySelectorAll(`.checkboxes`).forEach((el) => (el.innerHTML = ''));
    }

    function getText(text, val) {
        return _t(text, val, 'heros-detector');
    }

    function getProf(d) {
        return d.d.prof || '';
    }

    function getLevel(d) {
        return d.d.lvl || d.elasticLevel || '';
    }

    function getLevelLabelText(d) {
        const lvl = getLevel(d),
            prof = getProf(d);

        return lvl ? ` (${lvl}${prof})` : '';
    }

    function getNameLabelText(d) {
        const lvlText = getLevelLabelText(d);
        return (`${d.d.nick} ${lvlText}`).trim();
    }

    function getMapLabelText(d) {
        return getText('map-label %map% %x% %y%', {
            "%map%": Engine.map.d.name,
            "%x%": d.d.x,
            "%y%": d.d.y
        });
    }

    function createButtons($br, nameText, mapText, npcData) {
        // if (npcData.npcType === T.RESOURCES) return;

        const copyButton = getText("go");
        addButton($br, copyButton, () => {
            Engine.hero.autoGoTo({
                x: npcData.d.x,
                y: npcData.d.y
            })
        });
    }

    function showMenu(e, nameText, mapText, npcData) {
        if (npcData.npcType === T.RESOURCES) return;

        const contextMenu = [];

        if (Engine.party) {
            contextMenu.push([
                getText("call-party"),
                () => writeMessageTo("party", nameText, mapText, npcData.npcType)
            ]);
        }
        if (Engine.hero.d.clan != 0) {
            contextMenu.push([
                getText("call-clan"),
                () => writeMessageTo("clan", nameText, mapText, npcData.npcType)
            ]);
        }

        const exceptionWorlds = ['pandora', 'nerthus', 'syberia'];
        const npcTypesAllow = [T.HEROES, T.EVENT_HEROES];
        if (
            Engine.worldConfig.getPrivWorld() &&
            !exceptionWorlds.includes(Engine.worldConfig.getWorldName()) &&
            npcTypesAllow.includes(npcData.npcType)
        ) {
            contextMenu.push([
                getText("call-local"),
                () => writeMessageTo("local", npcData.d.nick, mapText, npcData.npcType)
            ]);
        }

        if (types[npcData.npcType].canFindGroup) {
            contextMenu.push([
                getText("find-group"),
                () => {
                    const filters = setFiltersForPlayersOnline(npcData);
                    Engine.worldWindow.open('players-online', {
                        filters
                    });
                }
            ]);
        }

        if (contextMenu.length) {
            Engine.interface.showPopupMenu(contextMenu, e);
            return true;
        }
        return false;
    }

    function setFiltersForPlayersOnline(npcData) {
        const
            filters = {
                minLvl: null,
                maxLvl: null
            },
            npcLvl = npcData.d.lvl,
            dropDestroyLvl = Engine.worldConfig.getDropDestroyLvl(),
            isPrivateWorld = Engine.worldConfig.getPrivWorld();

        switch (npcData.npcType) {
            case T.HEROES:
                filters.minLvl = npcLvl > 100 ? npcLvl - 50 : Math.floor(npcLvl / 2);
                filters.maxLvl = npcLvl + dropDestroyLvl;
                break;
            case T.EVENT_HEROES:
                filters.minLvl = Math.floor(npcLvl / 2);
                break;
            case T.SPECIAL_NPC:
                if (isPrivateWorld) {
                    filters.minLvl = npcLvl - 13; // it's always 13, not dropDestroyLvl
                    filters.maxLvl = npcLvl + dropDestroyLvl;
                } else {
                    filters.minLvl = npcLvl - 13; // it's always 13, not dropDestroyLvl
                    filters.maxLvl = npcLvl + 13; // it's always 13, not dropDestroyLvl
                }
                break;
            case T.TITANS:
            case T.COLOSSUS:
                filters.minLvl = npcLvl - 13; // it's always 13, not dropDestroyLvl
                filters.maxLvl = npcLvl + 13; // it's always 13, not dropDestroyLvl
                break;
        }
        return filters;
    }

    function showComponents($cnt, npcData, hwnd, index) {
        var nameText = getNameLabelText(npcData);
        var mapText = getMapLabelText(npcData);
        const $copyBtn = createCopyBtn(nameText, mapText, npcData.npcType);
        $("<div>").addClass("name-label").text(nameText).appendTo($cnt);
        $("<div>").addClass("map-label").text(mapText).append($copyBtn).appendTo($cnt);

        var $br = $("<div>").addClass("btns-container").appendTo($cnt);
        createButtons($br, nameText, mapText, npcData);

        var icon = CFG.a_npath + npcData.d.icon;
        var img = new Image();
        const $img = $(img);
        const $ppmInfo = $("<div>", {
            text: getText('RMB-info'),
            class: 'italic text-small mt-1'
        });
        if (isset(npcData.tip)) {
            const tipContent = npcData.npcType !== T.RESOURCES ? npcData.tip[0] + $ppmInfo.prop('outerHTML') : npcData.tip[0];
            $img.tip(tipContent, npcData.tip[1]);
        }
        img.src = icon;
        img.classList.add('icon', 'do-action-cursor');
        img.onload = function() {
            $img.insertBefore($cnt.find('.btns-container'));
            hwnd.show();
            hwnd.updatePos();
            windowSideWindow(hwnd, index);
        };
        $img.on('contextmenu', (e) => {
            showMenu(e, nameText, mapText, npcData);
        })
    }

    function createCopyBtn(nameText, mapText, npcType) {
        const $copyBtn = API.Templates.get('copy-btn');
        const msg = createMessage(nameText, mapText, npcType);
        $copyBtn.tip(_t('copy', null, 'heros-detector'));
        $copyBtn.on('click', () => copyToClipboard(msg));
        return $copyBtn;
    }

    function findWindowById(id) {
        for (var t in detectedHeroes) {
            var o = detectedHeroes[t];
            if (o.id === id)
                return o;
        }
        return null;
    }

    function showHeros(npcData, npcType) {
        npcData = {
            ...npcData,
            npcType
        }
        if (!Engine.targets.checkExistById(npcData.d.id)) {
            Engine.targets.addArrow('Npc-' + npcData.d.id, npcData.d.nick, npcData, 'Npc', 'navigate');
        }
        if (findWindowById(npcData.d.id) !== null) return;
        var heroObj = {
            id: npcData.d.id,
            wnd: null
        };
        detectedHeroes.push(heroObj);
        var $cnt = $("<div>").addClass("heros-detector");

        const hwnd = Engine.windowManager.add({
            content: $cnt,
            objParent: heroObj,
            nameRefInParent: 'wnd',
            title: addonName,
            //nameWindow          : 'addon_24',
            nameWindow: Engine.windowsData.name.addon_24,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 60
            },
            onclose: () => {
                closeWindow(heroObj);
            }
        });
        //hwnd.changeDraggableContainment('.game-window-positioner');
        hwnd.hide();
        hwnd.addControll(_t("close"), "small green", function() {
            closeWindow(heroObj);
        });
        hwnd.addToAlertLayer();
        showComponents($cnt, npcData, hwnd, detectedHeroes.length);
    }

    this.onResize = () => {
        let counter = 0;
        detectedHeroes.map(({
            wnd
        }) => {
            windowSideWindow(wnd, counter++);
        })
    }

    function removeNpc(npc) {
        const id = npc.d.id;
        const hero = detectedHeroes.find(heroObj => heroObj.id === id);

        if (hero && canCloseHeroWindow(npc)) closeWindow(hero);
    }

    function canCloseHeroWindow(npc) {
        const npcType = getNpcType(npc);
        const respTimeNeeded = [T.HEROES, T.TITANS];

        return (
            (respTimeNeeded.includes(npcType) && npc.d.respBaseSeconds > 0) ||
            !respTimeNeeded.includes(npcType)
        );
    }

    function closeAllWindows() {
        for (const t in detectedHeroes) {
            closeWindow(detectedHeroes[t]);
        }
    }

    function windowSideWindow(hwnd, index) {
        const i = index;
        var position = hwnd.$.position();
        const zoomFactor = Engine.zoomFactor || 1;
        var pos = {
            x: position.left / zoomFactor,
            y: position.top / zoomFactor
        };
        var offset = 15 * i;
        var nx = pos.x + offset;
        var ny = pos.y + offset;
        var w = $('body').width();
        var h = $('body').height();
        var b = ny + hwnd.$.height() + 30;
        var r = nx + hwnd.$.width() + 30;
        if (b < h && r < w) {
            pos.x = nx;
            pos.y = ny;
        }
        hwnd.setContentPos(pos.x + 'px', pos.y + 'px');
    }

    function closeWindow(obj) {
        var idx = detectedHeroes.indexOf(obj);
        if (idx !== -1) {
            detectedHeroes[idx].wnd.remove();
            delete detectedHeroes[idx].wnd;
            detectedHeroes.splice(idx, 1);
            Engine.targets.deleteArrow('Npc-' + obj.id);
        }
    }

    function addButton($el, value, cb) {
        var btn = API.Templates.get('button');
        btn.addClass("small green");
        btn.on("click", cb);
        $el.append(btn);
        btn.find('.label').html(value);
    }

    function createMessage(npc, map, npcType) {
        const npcNameText = types[npcType].showNameInMessage ? `${types[npcType].name}! ` : '';
        return `${npcNameText}${npc}, ${map}`;
    }

    function writeMessageTo(tpl, npc, map, npcType) {
        let msg = createMessage(npc, map, npcType);
        let channelName;

        if (tpl === "party") channelName = ChatData.CHANNEL.GROUP;
        if (tpl === "clan") channelName = ChatData.CHANNEL.CLAN;
        if (tpl === "local") {
            channelName = ChatData.CHANNEL.LOCAL;
            msg = getText('take_heroes', {
                '%name%': npc
            });
        }

        if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(channelName)) return;

        Engine.chatController.getChatInputWrapper().sendMessageGhostMessageProcedure(msg, channelName);
    }

    function newNpc(npc) {
        const npcType = getNpcType(npc);
        const type = npcType === T.EVENT_HEROES ? T.HEROES : npcType; // EVENT_HEROES need check HEROES is enabled
        if (npcType && data[type].checked) showHeros(npc, npcType);
    }

    function getNpcType(npc) {
        const npcId = Number(npc.d.id);
        if (isset(npc.d.isHeroFromEvent) && npc.d.isHeroFromEvent) return T.EVENT_HEROES;
        if (npc.d.wt >= 80 && npc.d.wt <= 89) return T.HEROES;
        if (npc.d.wt >= 90 && npc.d.wt <= 99) return T.COLOSSUS;
        if (npc.d.wt >= 100 && npc.d.wt <= 109) return T.TITANS;
        if (
            (isPl() && types[T.SPECIAL_NPC].idsPl.includes(npcId)) ||
            (!isPl() && types[T.SPECIAL_NPC].idsCom.includes(npcId))
        ) return T.SPECIAL_NPC;
        if (types[T.ALCHEMIST_BAGS].ids.includes(npcId)) return T.ALCHEMIST_BAGS;
        if (types[T.RESOURCES].ids.includes(npcId)) return T.RESOURCES;
        return false;
    }

    function initOptionsWindow() {
        const content = `
			<div id="${addonKey}">
				<div class="heading">${getText('heading')}</div>
				<div class="checkboxes"></div>
				<div class="btns-container"></div>
			</div>
		`;

        const optionsWndTitle = `${addonName} - ${_t('config-lower')}`

        optionsWnd = Engine.windowManager.add({
            content,
            title: optionsWndTitle,
            nameWindow: addonKey + '_settings',
            widget: Engine.widgetsData.name.addon_24,
            type: Engine.windowsData.type.TRANSPARENT,
            managePosition: {
                x: '251',
                y: '60'
            },
            addClass: 'detector-options-window',
            onclose: () => {
                close();
            }
        });

        optionsWnd.el = optionsWnd.$[0];
        optionsWnd.updatePos();
        optionsWnd.addToAlertLayer();
        setContent();
        setInitialData();
        setCheckboxes();
        close();
    }

    function open() {
        setInitialData();
        setCheckboxes();
        optionsWnd.show();
        optionsWnd.setWndOnPeak();
        optionsWnd.updatePos();
    }

    function close() {
        optionsWnd.hide();
        clearCheckboxes();
        tempData = null;
    }

    this.manageVisible = function() {
        if (!optionsWnd.isShow()) {
            open();
        } else {
            close();
        }
    }

    this.start = function() {
        if (running) return;
        running = true;
        setInitialData();
        $style = $(`<style>
		.heros-detector {
			text-align: center;
			color: white;
		}
		.heros-detector .name-label {
			margin-top: 5px;
		}
		.heros-detector .map-label {
			margin-top: 5px;
		}
		.heros-detector .icon {
			margin: 5px auto;
			max-width: 100%;
			display: block;
		}
		.heros-detector .btns-container {
			margin-bottom: -10px;
		}
		.heros-detector .btns-container .button + .button {
			margin-top: 3px;
		}
		.detector-options-window .heading {
			margin-bottom: 12px;
			color: white;
		}
		.detector-options-window .btns-container {
			display: flex;
			justify-content: center;
			margin-top: 10px;
		}
		</style>`).appendTo("head");
        API.addCallbackToEvent(Engine.apiData.NEW_NPC, newNpc);
        API.addCallbackToEvent(Engine.apiData.CLEAR_MAP_NPCS, closeAllWindows);
        API.addCallbackToEvent(Engine.apiData.REMOVE_NPC, function(npc) {
            removeNpc(npc);
        });
        initOptionsWindow();
    };

    this.stop = function() {
        if (!running) return;
        running = false;
        API.removeCallbackFromEvent(Engine.apiData.NEW_NPC, newNpc);
        closeAllWindows()
    };

}