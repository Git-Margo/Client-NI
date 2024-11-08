var Templates = require('core/Templates');
let MailsData = require('core/mails/MailsData').default;

module.exports = function() {
    var self = this;
    this.$ = null;
    var fraudExceptSend = ['Aukcjoner', 'Auctioneer', 'System', 'Grabarz', 'Baraki w Ithan', 'Zajazd u Makiny', 'Ratusz w Karka-han', 'Karczma pod ZÅotÄ WywernÄ', 'Karczma Umbara', 'Karczma pod Fioletowym KrysztaÅem', 'Karczma pod PosÄpnym Czerepem', 'Siedziba ergassaj', 'Alabastrowy Hotel', 'Knajpa pod Czarnym Tulipanem', 'Zajazd pod TÄczowym Å»ukiem', 'Zajazd pod ZÅamanym Dukatem', 'Kamienica Kandelia', 'Arena GladiatorÃ³w', 'Zajazd pod RÃ³Å¼Ä WiatrÃ³w', 'Tawerna pod BosmaÅskim Biczem', 'Kamienica Bursztynek', 'ZbÃ³jnicka spiÅ¼arnia', 'OberÅ¼a pod ZÅotym KÅosem', 'Austeria Karibiego', 'Kwatery u Morcera'];

    this.initMail = function({
        credits,
        gold,
        id,
        item,
        message,
        sender,
        recipientId,
        recipientNick,
        ts
    }, $ob, parent, kind) {
        this.parent = parent;
        this.id = id;
        this.$ = Templates.get('one-mail-wraper');
        this.$.data('id', this.id);
        this.ago = ts;
        this.container = $ob;
        this.kind = kind;
        if (this.kind === MailsData.RECEIVED) {
            this.from = sender;
            this.itemId = parseInt(item);
            this.money = parseInt(gold);
            this.tear = parseInt(credits);
            this.messageText = message;
            this.isSpecial = /\*/.test(this.from);
            this.checkSystemMsg();
        } else {
            this.idPlayer = recipientId;
            this.from = recipientNick;
            this.initMsgTextAndAtacment(message);
        }
    };

    this.createBodyMail = function(newW) {
        this.createOneMail();
        if (this.kind != MailsData.RECEIVED) return;
        this.createRemoveButton();
        this.createReplyButton();
        this.createAtachments();
        this.isNew(newW);
    };

    this.initMsgTextAndAtacment = function(str) {
        var res = str.split("\n\n[b]");
        var $aInfo = this.myFind('.a-info');
        var noA = '<b>' + _t('attachments', null, 'mails') + ' ' + _t('no_attach', null, 'mails');
        var info = res[1] ? parseMailBB('[b]' + res[1]) : noA;
        this.messageText = res[0];
        $aInfo.html(info);
    };

    this.createAtachments = function() {
        var $aInfo = this.myFind('.a-info');
        var str = '<b>' + _t('attachments', null, 'mails') + '<b>';
        if (this.itemId) {
            this.createMailItem();
        }
        if (this.money) {
            str = _t('gold_att %amount%', {
                '%amount%': formNumberToNumbersGroup(this.money)
            }, 'mails');
            this.myFind('.a-money').addClass('atachment-exist').tip(str, 't_notif').click(function() {
                self.checkGoldLimit(true);
            });
        }
        if (this.tear) {
            str = _t('sl_att %amount%', {
                '%amount%': this.tear
            }, 'mails');
            this.myFind('.a-tears').addClass('atachment-exist').tip(str, 't_notif').click(function() {
                self.checkGoldLimit(true);
            });
        }
        if (!this.money && !this.itemId && !this.tear) {
            str += ' ' + _t('no_attach', null, 'mails');
            $aInfo.html('&nbsp;' + str);
        }
    };

    this.createMailItem = function() {
        var $aItem = self.myFind('.a-item').addClass('item-attachment-' + this.itemId);
        var $clone = Engine.items.createViewIcon(this.itemId, Engine.itemsViewData.MAIL_ATTACHMENT_ITEM_VIEW)[0];
        if (!$clone) return;
        const item = $clone.data().item;

        $aItem.addClass('atachment-exist mail-item-' + this.itemId);
        $aItem.append($clone);
        $aItem.css('position', 'relative');

        $aItem.click(function() {
            self.checkGoldLimit(true);
        });

        $aItem.contextmenu(function(e, mE) {
            var callback = {
                txt: _t('take_mail'),
                f: function() {
                    self.checkGoldLimit(true);
                }
            };
            item.createOptionMenu(getE(e, mE), callback);
        });
    }

    this.createRemoveButton = function() {
        var $x = Templates.get('button').addClass('small removeMsg');
        var footer = this.$.find('.mail-footer');
        var str = this.money || this.itemId || this.tear ? _t('mail_take_and_del') : _t('del_message', null, 'mails');

        $x.find('.label').text(str);
        footer.append($x);
        $x.click(function() {
            self.checkGoldLimit();
        });
    };

    this.createReplyButton = () => {
        if (this.isSpecial) return;

        var $reply = Templates.get('button').addClass('small green');
        var footer = this.$.find('.mail-footer');

        $reply.find('.label').text(_t('reply', null, 'mails'));
        footer.append($reply);
        $reply.click(() => {
            this.parent.removeInboxNotification();
            this.parent.showMailCreator(this.from);
        });
    };

    this.createOneMail = function() {
        var str = this.kind == MailsData.RECEIVED ? 'from' : 'to';
        var $mC = this.$.children('.msg-content');
        var sAgo = calculateDiff(unix_time(), this.ago);
        var sWhen = _t('ago %ago%', {
            '%ago%': sAgo
        }, 'mails');
        var nickHtml = this.from.replace(/\*/g, '');
        var sFrom = _t(str, null, 'mails') + '<b>' + nickHtml + '</b>';
        var small = ut_fulltime(this.ago);

        this.myFind('.from').html(sFrom);

        if (this.isSpecial) {
            this.myFind('.from').addClass('special');
            this.myFind('.from').tip(_t('npc_msg'));
        }
        this.container.append(this.$);
        this.myFind('.when').html(sWhen);
        this.myFind('.small').html(small);
        $mC.html(this.setMessageText());
    };

    this.checkGoldLimit = function(state) { //if state true onny get Atachment
        var limit = parseInt(Engine.hero.d.goldlim);
        var gold = parseInt(Engine.hero.d.gold);

        if (!this.money) {
            this.requestAction(state);
            return false;
        }
        if (this.money + gold > limit) self.requestAction(state);
        else this.requestAction(state);
    };

    this.requestAction = function(onlyGet) {
        if (onlyGet) {
            _g(`mail&action=get&id=${this.id}`);
        } else {
            const currentPage = Engine.mails.getMailsPages().getCurrentPage();
            _g(`mail&action=delete&id=${this.id}&lastPage=${currentPage}`);
        }
    };

    this.checkFraud = function(txt) {
        //words check
        var fraudWords = ['hasÅ', 'pass', 'login', 'logo', 'konto'];
        var fraudPattern = new RegExp(fraudWords.join('|'), 'ig');
        if (fraudPattern.test(txt)) return true;

        //urls check
        var pattern = new RegExp('https?://([-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|])', 'ig');
        var urlPattern = new RegExp('^http://([a-z1-9.]*?)(margonem\.pl)[^/\\?=a-z]?', 'ig');
        var result = null;

        if (pattern.test(txt)) {
            do {
                result = pattern.exec(txt);
                if (result && urlPattern.test(result[0])) return true;
            } while (result);
        }

        return false;
    };


    this.setMessageText = function() {
        if (this.kind == MailsData.RECEIVED) {
            var str = _t('fraud_possible', null, 'mails');
            var fraud = this.checkFraud(this.messageText) && fraudExceptSend.indexOf(this.messageText) < 0;
            if (fraud) {
                var $div = Templates.get('mail-fraud').html(str);
                this.$.find('.one-mail-head').after($div);
            }
        }
        return parseMailBB(deletePositionFixed(this.messageText));
    };

    this.checkSystemMsg = function() {
        if (this.isSpecial) return;
        if (fraudExceptSend.indexOf(this.from) > -1) this.isSpecial = true;
    };

    this.myFind = function(child) {
        return this.$.children().children(child);
    };

    this.isNew = function(newM) {
        if (!newM) return;
        var span = Templates.get('mail-is-new').addClass(_l());
        this.$.prepend(span);
    };

};