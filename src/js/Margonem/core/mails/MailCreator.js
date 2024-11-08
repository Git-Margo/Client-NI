const InputMaskData = require('core/InputMaskData');
const tpl = require('core/Templates');
const MailsData = require('./MailsData').default;

module.exports = function(content) {

    const init = () => {
        const labels = [
            ['.to-label', _t('to', null, 'mails') + ' '],
            ['.cost-label', _t('send_cost', null, 'mails')],
            ['.money-label', _t('gold_attachment', null, 'mails') + ' '],
            ['.item-label', _t('item_attachment', null, 'mails')],
            ['.hr', _t('attachments', null, 'mails')]
        ];
        labels.map((label) => {
            content.find(label[0]).html(label[1]);
        })

        setInputMask(content.find('.money-amount'), InputMaskData.TYPE.NUMBER_WITH_KMG)
        addButtons();
        initKeypress();
        initDroppable();
    };

    const addButtons = () => {
        const $s = tpl.get('button').addClass('small green');
        const $clan = tpl.get('button').addClass('green small');
        const $smb = content.find('.send-mail-buttons');
        const $tp = content.find('.to-buttons');
        const $mailTo = content.find('.mail-to');

        createBackgroundInButton('clan', $clan);
        $s.find('.label').text(_t('send', null, 'mails'));
        $s.click(() => {
            sendMail();
        });
        $clan.click(() => {
            $mailTo.val(_t('clanmsg_rcp_name', null, 'mails'));
        });
        $smb.append($s);
        $tp.append($clan);
    };

    const setSendItem = (item) => {
        if (checkSoulbound(item)) {
            mAlert(_t('soulbound_item', null, 'mails'));
            return;
        }
        const id = item.id;
        const $clone = Engine.items.createViewIcon(id, Engine.itemsViewData.MAIL_ITEM_TO_SEND_VIEW)[0];
        const $itemSlot = content.find('.send-item');

        $clone.css('position', 'relative');
        $clone.css({
            'top': '2px',
            'left': '2px'
        });
        $clone.data('item', item);
        $clone.click(() => {
            removeAttachmentToSend(id, $clone, $itemSlot);
        });

        $clone.contextmenu(function(e, mE) {
            const callback = {
                txt: _t('unbuy all'),
                f: function() {
                    $clone.remove();
                    $itemSlot.removeAttr('iid');
                },
            };
            item.createOptionMenu(getE(e, mE), callback, {
                move: true,
                use: true
            });
        });

        $itemSlot.empty();
        Engine.itemsMovedManager.removeItemsByTarget(Engine.itemsMovedData.MAIL_ITEM_TO_SEND);
        $itemSlot.removeAttr('iid').attr('iid', id);
        $itemSlot.append($clone);

        Engine.itemsMovedManager.addItem(item, Engine.itemsMovedData.MAIL_ITEM_TO_SEND, () => {
            removeAttachmentToSend(id, $clone, $itemSlot);
        });

        show();
    };

    const show = (name) => {
        if (name) content.find('.mail-to').val(name);
        Engine.mails.getMailsWindow().manualSelectTab(MailsData.NEW_MAIL);
    };

    const sendMail = () => {
        const price = parsePrice((getValue('.money-amount', true)).replace(/ /gi, ''));

        if (price !== '') {
            if (!checkParsePriceValueIsCorrect(price)) return;
        }

        const task =
            'mail&action=send&recipient=' + esc(getValue('.mail-to', true)) +
            '&gold=' + price +
            '&item=' + getValue('.send-item', false, 'iid') + '&msg=' +
            esc(getValue('.mail-msg', true));
        _g(task, (v) => {
            if (isset(v.message) && isset(v.message[3201002])) clear();
        });
    };

    const getValue = (element, value, attr) => {
        const $o = content.find(element);
        let val;

        if (attr) val = $o.attr(attr);
        if (value) val = $o.val();

        return (val == '' || !val) ? '' : val;
    };

    const removeAttachmentToSend = (id, $view, $itemSlot) => {
        $view.remove();
        $itemSlot.removeAttr('iid');
        Engine.itemsMovedManager.removeItem(id);
    };

    const checkSoulbound = (item) => {
        return isset(item._cachedStats['soulbound']);
    };

    const createBackgroundInButton = (addClass, $button) => {
        const $bck = tpl.get('add-bck').addClass(addClass);
        $button.append($bck);
        $button.tip(_t('clan_mail'));
    };

    const countChars = () => {
        const $mailMsg = content.find('.mail-msg');
        const $info = content.find('.how-mail-or-char');
        const messageLength = $mailMsg.val().length;

        if (messageLength > 1000) $mailMsg.val($mailMsg.val().substring(0, 1000));

        const prc = getCurrencyIcon('zl');
        const str = _t('chats_left %amount%', {
            '%amount%': messageLength
        }, 'mails') + '<br>' + _t('send_cost') + prc;
        const $span = $('<span>').html(str);

        $info.html($span);
    };

    const clear = () => {
        clearMailItemToSendIcon();
        content.find('.mail-to, .mail-msg, .money-amount').val('');
    };

    const clearMailItemToSendIcon = () => {
        let $sendItem = content.find('.send-item');
        let id = $sendItem.attr('iid');

        if (id) {
            $sendItem.removeAttr('iid').empty();
            Engine.items.deleteViewIconIfExist(id, Engine.itemsViewData.MAIL_ITEM_TO_SEND_VIEW);
            Engine.itemsMovedManager.removeItem(id);
        }
    };

    const initKeypress = () => {
        content.find('.mail-msg').keyup(() => {
            countChars();
        });
    };

    const initDroppable = () => {
        content.find('.send-item').droppable({
            accept: '.inventory-item',
            drop: (e, ui) => {
                ui.draggable.css('opacity', '');
                setSendItem(ui.draggable.data('item'), false);
            }
        });
    };

    this.countChars = countChars;
    this.setSendItem = setSendItem;
    this.show = show;
    this.clear = clear;

    init();
}