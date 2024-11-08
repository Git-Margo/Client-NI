const tpl = require('core/Templates');
const Storage = require('core/Storage');
module.exports = function() {
    let content;
    let formEl;
    let pollId;
    let confirmButtonEl;
    let config = {
        rateRange: [1, 10],
        pollApiUrl: null,
        pollApiUrlPush: null,
        pollHitKey: 'pollHit',
        pollDisplayedKey: 'pollDisplayed'
    }

    function setAttributes(el, attrs) {
        for (const key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    this.getApiDomain = () => {
        return this.getEngine().worldConfig.getApiDomain();
    }

    this.getConfig = () => {
        return config;
    }

    this.setApiUrl = () => {
        const
            hs3 = this.getHS3Cookie(),
            pollApiDomain = this.getApiDomain();

        this.getConfig().pollApiUrl = `${pollApiDomain}/surveys/get?hs3=${hs3}`;
        this.getConfig().pollApiUrlPush = `${pollApiDomain}/surveys/vote`;
    };

    this.init = () => {
        this.canHitForPoll().then(can => {
            if (can) {
                this.setPollHitDate();
                this.getPollData();
            }
        });
    };

    this.canHitForPoll = async () => {
        const hasPollDisplayedToday = await this.hasPollDisplayedToday();
        return !(this.hasPollHitToday() || hasPollDisplayedToday);
    };

    this.hasPollDisplayedToday = async () => {
        const pollDisplayedDate = await Engine.crossStorage.get(this.getConfig().pollDisplayedKey);
        return pollDisplayedDate && pollDisplayedDate === getCurrentDate();
    };

    this.setPollDisplayedDate = () => {
        Engine.crossStorage.set(this.getConfig().pollDisplayedKey, getCurrentDate());
    };

    this.hasPollHitToday = () => {
        const pollHitDate = Storage.get(this.getConfig().pollHitKey);
        return pollHitDate && pollHitDate === getCurrentDate();
    };

    this.setPollHitDate = () => {
        Storage.set(this.getConfig().pollHitKey, getCurrentDate());
    };

    this.getPollData = () => {
        this.setApiUrl();
        fetch(this.getConfig().pollApiUrl, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            const survey = data.survey;
            if (survey) {
                this.updateData({
                    data: survey
                });
            } else if (isset(data.error)) {
                console.warn('[Poll.js, getPollData] Poll - Something went wrong.');
            }
        }).catch((err) => {
            console.warn('[Poll.js, getPollData] Poll - Something went wrong.', err);
        });
    };

    this.updateData = ({
        data
    }) => {
        if (isset(data)) {
            pollId = data.id;
            this.openPoll({
                data
            });
        }
    };

    this.openPoll = ({
        data
    }) => {
        this.close(); // return;

        this.setPollDisplayedDate();
        this.initWindow();
        this.create({
            data
        });

        this.wnd.center();
    };

    this.create = ({
        data
    }) => {
        this.createQuestion({
            data
        });
        this.createConfirmButton();
        formEl = this.wnd.el.querySelector('form');
    };

    this.createQuestion = ({
        data
    }) => {
        const listEl = content.querySelector('.poll__list');
        data.questions.forEach((el, index, array) => {
            const listItemEl = tpl.get('poll__list-item')[0];
            const answersEl = listItemEl.querySelector('.poll__answers');
            listItemEl.querySelector('.poll__question').textContent = `${index+1}. ${el}`;
            this.createAnswers(answersEl, index + 1);
            listEl.appendChild(listItemEl);
        });
    };

    this.createAnswers = (answersEl, questionId) => {
        const rateRange = this.getConfig().rateRange;
        for (let i = rateRange[0]; i <= rateRange[1]; i++) {
            const ansId = `answer_${questionId}-${i}`;
            const answerEl = document.createElement("div");
            answerEl.classList.add('poll__answers-item');

            const radioEl = document.createElement("input");
            setAttributes(radioEl, {
                type: 'radio',
                value: i,
                id: ansId,
                name: `q_${questionId}`,
                required: true
            });
            radioEl.addEventListener('change', this.checkValid);

            const labelEl = document.createElement("label");
            setAttributes(labelEl, {
                for: ansId
            });
            labelEl.textContent = i.toString();

            answerEl.appendChild(radioEl);
            answerEl.appendChild(labelEl);
            answersEl.appendChild(answerEl);
        }
        return answersEl;
    };

    this.createConfirmButton = () => {
        confirmButtonEl = createButton(_t('send', null, 'mails'), ['small', 'green', 'disable'], this.confirmOnClick);
        content.querySelector('.poll__confirm').append(confirmButtonEl);
    };

    this.checkValid = () => {
        if (formEl.checkValidity()) {
            confirmButtonEl.classList.remove('disable');
            return true;
        } else {
            confirmButtonEl.classList.add('disable');
            return false;
        }
    };

    this.getHS3Cookie = () => {
        return getCookie('hs3');
    };

    this.confirmOnClick = () => {
        const answers = $(formEl).serializeArray().map(answer => parseInt(answer.value));
        const obj = {
            vote: pollId,
            w: this.getEngine().worldConfig.getWorldName(),
            answer: answers,
            hs3: this.getHS3Cookie()
        };

        const response = fetch(this.getConfig().pollApiUrlPush, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            //mode: 'no-cors', // no-cors, *cors, same-origin
            credentials: 'include',
            headers: {
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(obj)
        }).then((response) => {
            if (response.status === 0) return null;
            return response.json();
        }).then((data) => {
            //console.log(data);
        }).catch((err) => {
            console.warn('[Poll.js, confirmOnClick] Something went wrong.', err);
        });

        this.close();
    };

    this.initWindow = () => {

        content = this.getDefaultContent();

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'poll',
            nameWindow: Engine.windowsData.name.POLL,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('poll'),
            addClass: 'poll-window',
            onclose: () => {
                this.close();
            }
        });
        // this.setDefaultContent();
        this.wnd.el = this.wnd.$[0];
        //this.wnd.el.classList.add('poll-window');
        this.wnd.addToAlertLayer();
    };

    this.getDefaultContent = () => tpl.get('poll')[0];

    this.close = () => {
        if (!isset(this.wnd)) return;
        //this.wnd.$.remove();
        this.wnd.remove();
        // delete (this.wnd);
    };

    this.getEngine = () => {
        return Engine;
    }
};