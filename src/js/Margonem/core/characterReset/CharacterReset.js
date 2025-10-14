const CostComponent = require('@core/components/CostComponent');
const OutfitCardList = require('@core/components/OutfitCardList');
const RadioList = require('@core/components/RadioList');
const Templates = require('../Templates');
const ProfData = require('@core/characters/ProfData');

module.exports = function() {

    let content = null;
    let wnd = null;
    let prof = null;
    let gender = null;
    let outfitCardList = null;
    let outfitProfData = null;
    let display = null;
    let costComponent = null;

    const moduleData = {
        fileName: "CharacterReset.js"
    };
    const GENDER = "sex";
    const PROF = "prof";
    const PAYMENT = "payment";

    const init = () => {
        initWindow();
        initDisplay();
        initOutfitProfData();
        initGender();
        initCost();
        initOutfitCardList();
        initConfirmButton();
    };

    const initDisplay = () => {
        display = {
            [GENDER]: false,
            [PROF]: false,
            [PAYMENT]: false
        }
    };

    const initCost = () => {
        costComponent = new CostComponent();

        costComponent.init();

        content.find('.payment-wrapper')[0].appendChild(costComponent.getElement());
    }

    const checkCorrectDisplayOption = (displayOption) => {
        if (!isset(display[displayOption])) {
            errorReport(moduleData.fileName, "undefined display option", displayOption)
            return false
        }

        return true
    }

    const setDisplay = (displayName, val) => {
        if (!checkCorrectDisplayOption(displayName)) {
            return;
        }

        display[displayName] = val;
    };

    const getDisplay = (displayName) => {
        return display[displayName] ? true : false
    }

    const updateDisplay = () => {
        for (let displayName in display) {
            let state = getDisplay(displayName);
            let selector = "." + displayName + "-section";

            content.find(selector).css('display', state ? "block" : "none");
        }

        let showProfDescription = getDisplay(PROF) && !getDisplay(GENDER);

        content.find('.prof-description').css('display', showProfDescription ? 'block' : 'none');

        if (showProfDescription) {
            content.find('.prof-description').css('display', showProfDescription ? 'block' : 'none');
            updateOutfits(Engine.hero.d.gender);
        }

        wnd.center();
    };

    const setProf = (_prof) => {
        prof = _prof;
    };

    const setGender = (_gender) => {
        gender = _gender
    };

    const initConfirmButton = () => {
        let btn = createButton(_t('confirm'), ['confirmButton', 'small', 'green', 'disable'], function() {
            close();
            let req = `talk&action=reset`;

            if (getDisplay(GENDER)) {
                req += `&sex=${gender}`;
            }

            if (getDisplay(PROF)) {
                req += `&prof=${prof}`;
            }

            _g(req);
        });

        content.find('.button-wrapper')[0].appendChild(btn);
    };

    const initWindow = () => {
        content = Templates.get('character-reset');

        wnd = Engine.windowManager.add({
            content: content,
            title: _t("characterReset", null, "characterReset"),
            nameWindow: Engine.windowsData.name.CHARACTER_RESET,
            backdrop: Engine.interface.get$alertsLayer(),
            onclose: () => {
                close(true);
            }
        });

        wnd.addToAlertLayer();
        //wnd.center();
    };

    const initGender = () => {
        let radioListData2 = {
            radios: [{
                    value: 'm',
                    label: _t('male'),
                    selected: false,
                    id: 0
                },
                {
                    value: 'f',
                    label: _t('female'),
                    selected: false,
                    id: 1
                },
            ],
            onSelected: function(e1) {
                setGender(e1.target.value);

                updateOutfits(gender);

                activeConfirmButton();
            }
        };

        const radioList2 = new RadioList.default(radioListData2, {
            isInline: true
        }).getList();

        content.find('.sex-wrapper')[0].appendChild(radioList2);
    };

    const initOutfitProfData = () => {
        outfitProfData = [{
                id: ProfData.WARRIOR,
                m: "woj/30/m_woj07.gif",
                f: "woj/60/f_woj11.gif",
                text: _t('prof_warrior', null, "eq_prof"),
                description: _t('prof_warrior_description', null, "eq_prof")

            },
            {
                id: ProfData.BLADE_DANCER,
                m: "bd/100/m_bd07.gif",
                f: 'bd/80/f_bd01.gif',
                text: _t('prof_bladedancer', null, "eq_prof"),
                description: _t('prof_bladedancer_description', null, "eq_prof")
            },
            {
                id: ProfData.PALADIN,
                m: "pal/90/m_pal25.gif",
                f: 'pal/90/f_pal18.gif',
                text: _t('prof_paladyn', null, "eq_prof"),
                description: _t('prof_paladyn_description', null, "eq_prof")
            },
            {
                id: ProfData.MAGE,
                m: "mage/100/m_mag04.gif",
                f: 'mage/90/f_mag20.gif',
                text: _t('prof_mag', null, "eq_prof"),
                description: _t('prof_mag_description', null, "eq_prof")
            },
            {
                id: ProfData.HUNTER,
                m: "hun/70/m_hun04.gif",
                f: 'hun/70/f_hun02.gif',
                text: _t('prof_hunter', null, "eq_prof"),
                description: _t('prof_hunter_description', null, "eq_prof")
            },
            {
                id: ProfData.TRACKER,
                m: "trop/90/m_tr27.gif",
                f: 'trop/90/f_tr20.gif',
                text: _t('prof_tracker', null, "eq_prof"),
                description: _t('prof_tracker_description', null, "eq_prof")
            }
        ]
    };

    const getUrlByIdAndGender = (id, _gender) => {

        _gender = _gender == 'f' ? "f" : 'm';

        for (let k in outfitProfData) {
            if (outfitProfData[k].id == id) {

                return outfitProfData[k][_gender]
            }
        }

        return null;
    }

    const createDataToOutfitCardList = () => {
        let dataToOutfitCardList = [];

        for (let k in outfitProfData) {

            let oneData = outfitProfData[k];
            let id = oneData.id;

            dataToOutfitCardList.push({
                id: id,
                text: oneData.text,
                url: getUrlByIdAndGender(id, gender)
            })
        }

        return dataToOutfitCardList;
    };

    const initOutfitCardList = () => {
        outfitCardList = new OutfitCardList();
        outfitCardList.init();

        updateOutfitCardList();
    }


    const updateOutfitCardList = () => {
        let data = createDataToOutfitCardList();

        outfitCardList.updateData(data, content.find('.prof-wrapper'), function(state, activeElement) {
            setProf(activeElement.getId());
            activeConfirmButton();

            let description = getDescription(prof);

            if (description) {
                content.find('.prof-description').html(description);
            }
        });
    };

    const getDescription = (_prof) => {
        for (let k in outfitProfData) {
            let oneData = outfitProfData[k];
            if (oneData.id == _prof) {
                return oneData.description;
            }
        }

        return null
    }

    const updateOutfits = (_gender) => {
        let outfitCards = outfitCardList.getOutfitCards();

        for (let k in outfitCards) {

            let oneOutfitCard = outfitCards[k];
            let id = oneOutfitCard.getId();
            let url = getUrlByIdAndGender(id, _gender);

            oneOutfitCard.setOutfit(url);
        }
    }

    const activeConfirmButton = () => {
        //if (prof != null && gender != null) {

        let proffAllow = !getDisplay(PROF) || getDisplay(PROF) && prof != null;
        let genderAllow = !getDisplay(GENDER) || getDisplay(GENDER) && gender != null;

        if (proffAllow && genderAllow) {
            content.find('.confirmButton').removeClass('disable');
        }
    };

    const updateData = (v) => {
        /*
        let opt = 0;

        switch (opt) {

            case 0:

                v = {
                    "show": {
                        "gender": true,
                        "prof": true,
                        "payment": {
                            "credits": 123
                        }
                    }
                };
                break;
            case 1:
                v = {
                    "show": {
                        "gender": true,
                        "payment": {
                            "credits": 123
                        }
                    }
                };
                break;
            case 2:
                v = {
                    "show": {
                        "gender": true,
                        "prof": true
                    }
                };
                break;
            case 3:
                v = {
                    "show": {
                        "gender": true
                    }
                };
                break;
            case 4:

                v = {
                    "show": {
                        "prof": true,
                        "payment": {
                            "credits": 123
                        }
                    }
                };
                break;
            case 5:
                v = {
                    "show": {
                        "prof": true
                    }
                }
                break;
        }

        */

        let showDataToUpdate = v.show;

        for (let optionName in showDataToUpdate) {
            updateOption(optionName, showDataToUpdate[optionName])
        }

        updateDisplay();
    };

    const updateOption = (name, val) => {

        if (!checkCorrectDisplayOption(name)) {
            return
        }

        setDisplay(name, true);

        switch (name) {
            case GENDER:
                break;
            case PROF:
                break;
            case PAYMENT:
                costComponent.updateData({
                    currency: "credits",
                    price: round(val.credits, 2)
                });
                break;
        }

    }

    const close = (closeRequest) => {

        if (closeRequest) {
            _g('talk&action=cancel');
        }

        outfitCardList.destroy();
        wnd.remove();

        getEngine().characterReset = null;
    };

    const onClear = () => {
        close();
    };

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;

};