const Mail = require('./Mail');
const MailsData = require('./MailsData').default;
const MailsWindow = require('./MailsWindow').default;
const MailsPages = require('./MailsPages');
const MailCreator = require('./MailCreator');
const tpl = require('@core/Templates');
const Button = require('../components/Button');

module.exports = function() {
    let content;
    let mails = {};
    let currentTab = null;
    let mailsPages = null;
    let mailsWindow = null;
    let mailCreator = null;

    const column = {
        [MailsData.RECEIVED]: null,
        [MailsData.SENT]: null,
        [MailsData.NEW_MAIL]: null
    };

    const init = () => {
        mailsPages = new MailsPages();
        mailsWindow = new MailsWindow();
        content = mailsWindow.getWindow();
        setContentInTabs();
        mailCreator = new MailCreator(content);
        Engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.MAIL);
    };

    const setCurrentTab = (tab) => {
        currentTab = tab;
    }

    const setContentInTabs = () => {
        column[MailsData.RECEIVED] = content.find(`.${MailsData.RECEIVED}-content`);
        column[MailsData.SENT] = content.find(`.${MailsData.SENT}-content`);
        column[MailsData.NEW_MAIL] = content.find(`.${MailsData.NEW_MAIL}-content`);

        column[MailsData.RECEIVED].append(tpl.get('mail-column'));
        column[MailsData.SENT].append(tpl.get('mail-column'));
        column[MailsData.NEW_MAIL].append(tpl.get('new-message').addClass('mail-column'));

        $('.scroll-wrapper', column[MailsData.RECEIVED]).addScrollBar({
            track: true,
            callback: scrollMove
        });
        $('.scroll-wrapper', column[MailsData.SENT]).addScrollBar({
            track: true,
            callback: scrollMove
        });

        setContentInFooter();
    }

    const setContentInFooter = () => {
        const $footerReceived = column[MailsData.RECEIVED].find('.footer');
        const refreshBtn = new Button.default({
            text: _t('refresh', null, 'mails'),
            classes: ['small', 'green'],
            action: () => {
                _g('mail&action=refresh');
            }
        })
        $footerReceived.append(refreshBtn.getButton());
    }

    const scrollMove = () => {
        mailsPages.getNextPageAction();
    }

    const scrollTop = () => {
        $('.scroll-wrapper', column[currentTab]).trigger('scrollTop');
    };
    const updateScroll = () => {
        $('.scroll-wrapper', column[currentTab]).trigger('update');
    };
    const updateBarPos = () => {
        $('.scroll-wrapper', column[currentTab]).trigger('updateBarPos');
    };
    const stopDragBar = () => {
        $('.scroll-wrapper', column[currentTab]).trigger('stopDragBar');
    };

    const setInfoMailsBox = (total) => {
        const $how = content.find('.how-mail-or-char');
        const amount = isset(total) ? total : column[currentTab].find('.one-mail-wraper').length;
        const strMsg = _t(amount == 1 ? 'msg' : 'msgs', null, 'mails');
        let str = '';

        if (currentTab === MailsData.RECEIVED) str = _t('receive_amount_message', null, 'mails');
        else str = _t('send_amount_message', null, 'mails')
        str += amount + ' ' + strMsg;

        const $span = $('<span>').html(str);
        $how.html($span);
    };

    const removeInboxNotification = () => {
        if (currentTab === MailsData.RECEIVED) {
            content.find('.is-new').remove();
            content.find('.amount-new-msg').empty();
        }
    };

    const changedTab = (tab) => {
        setCurrentTab(tab);
        if (currentTab === MailsData.NEW_MAIL) {
            mailCreator.countChars();
        } else {
            mailCreator.clear();
        }
    }

    const updateData = (data) => {
        if (isset(data.removeAttachments)) {
            data.removeAttachments.list.map(attachment => removeMailAttachment(attachment))
        }
        if (isset(data.remove)) {
            data.remove.list.map(mail => deleteMail(mail.id))
        }
        if (isset(data.show)) {
            mailsWindow.manualSelectTab(data.show.tab);

            const $mailsContainer = column[currentTab].find('.scroll-pane');
            setInfoMailsBox(data.show.totalMails);

            if (data.show.page) {
                mailsPages.updatePages(data.show.page, isReceived());
            }

            const currentPage = mailsPages.getCurrentPage();
            const maxPage = mailsPages.getMaxPage();
            const firstPageUpdate = (currentPage === 1 || maxPage === 0) && !isset(data.remove);

            if (firstPageUpdate) {
                clearMessages($mailsContainer);
                scrollTop();
            }

            createMessages(data.show.list, $mailsContainer);

            mailBoxEmpty($mailsContainer);
            if (isReceived()) {
                Engine.interface.deleteNotif('mailnotifier');
                getEngine().interface.get$interfaceLayer().find('.character_wrapper').find('.mail-notifier-light-mode').remove()
            }

            if (firstPageUpdate) updateScroll();
            updateBarPos()
        }
    };

    const createMessages = (list, $mailsContainer) => {
        const $tempMailsContainer = tpl.get('mails-container');
        let isNew = false;

        list.map(mail => {
            if (isset(mails[mail.id])) return mail;
            isNew = this.isNew(currentTab);
            mails[mail.id] = new Mail();
            mails[mail.id].initMail(mail, $tempMailsContainer, this, currentTab);
            mails[mail.id].createBodyMail(isNew);
        })

        if (list.length > 0) $mailsContainer.append($tempMailsContainer.children());
    }

    const clearMessages = ($cont) => {
        $cont.html('');
        mails = {}
    }

    this.isNew = (kind) => {
        if (Engine.interface.mailsElements.counter > 0 && kind === MailsData.RECEIVED) {
            Engine.interface.mailsElements.counter--;
            return true;
        }
        return false;
    };

    const isReceived = () => currentTab === MailsData.RECEIVED;

    const mailBoxEmpty = ($cont) => {
        const mailsAmount = $cont.children('.one-mail-wraper').length;

        $cont.find('.mail-box-empty').remove();

        if (mailsAmount === 0) {
            const str = _t('no_msg', null, 'mails');
            const $div = tpl.get('mail-box-empty');
            const $span = $('<span>').html(str);
            $div.html($span);
            $cont.append($div);
        }
    };

    const removeMailAttachment = ({
        id,
        gold
    }) => {
        const mail = mails[id];
        mail.money = gold;

        if (mail.money === 0) {
            const str = _t('attachments', null, 'mails') + ' ' + _t('no_attach', null, 'mails');
            mail.$.find('.a-money').remove();
            mail.$.find('.a-tears ').remove();
            mail.$.find('.a-info').html('&nbsp;' + str);

            const str2 = _t('del_message', null, 'mails');
            mail.$.find('.removeMsg .label').text(str2);
        } else {
            const str = _t('gold_att %amount%', {
                '%amount%': formNumberToNumbersGroup(mail.money)
            }, 'mails');
            mail.$.find('.a-money').tip(str);
        }
        mail.$.find('.a-item').remove();
    };

    const deleteMail = (id) => {
        mails[id].$.remove();
        const $mailsContainer = column[currentTab].find('.scroll-pane');
        mailBoxEmpty($mailsContainer);
        delete mails[id];
    };

    const getEngine = () => Engine;

    const close = () => {
        mails = {};
        mailCreator.clear();
        getEngine().items.deleteMessItemsByLoc('b');
        getEngine().itemsMovedManager.removeItemsByTarget(Engine.itemsMovedData.MAIL_ITEM_TO_SEND);
        getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.MAIL);
        getEngine().mails = null;
    };

    this.showMailCreator = (name) => mailCreator.show(name);
    this.setSendItem = (item) => mailCreator.setSendItem(item);
    this.getMailsPages = () => mailsPages;
    this.getMailsWindow = () => mailsWindow;
    this.init = init;
    this.updateData = updateData;
    this.changedTab = changedTab;
    this.stopDragBar = stopDragBar;
    this.removeInboxNotification = removeInboxNotification;
    this.close = close;
};