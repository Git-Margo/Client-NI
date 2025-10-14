//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;
    var lastQuestState = '';
    var hideFinished = true;
    var allQuestsAmount;
    var completQuestAmount;

    this.update = function(v) {
        this.clearQuestsList();
        this.resetLastQuestState();
        this.createQuests(v);
        this.updateScroll();
        this.hideOrShowFinished();
        this.initQuestHeader();
    };

    this.initToogleShowBtn = function() {
        var $btn = tpl.get('button').addClass('small green');
        content.find('.toggle-show').append($btn);
        $btn.click(function() {
            hideFinished = !hideFinished;
            self.hideOrShowFinished();
            self.updateScroll();
        });
    };

    this.hideOrShowFinished = function() {
        var display = hideFinished ? 'none' : 'block';
        content.find('.complete-and-unactive-quests').css('display', display);
        var $label = content.find('.toggle-show').find('.label');
        var str = (hideFinished ? 'show' : 'hide') + '-finish';
        $label.html(Par.tLang(str));
    };

    this.createQuests = function(data) {
        var $sp = content.find('.scroll-pane');
        allQuestsAmount = 0;
        completQuestAmount = 0;
        for (var one in data) {
            this.createOneQuest(one, data[one], $sp);
            if (data[one].finished) completQuestAmount++;
            allQuestsAmount++;
        }
    };

    this.clearQuestsList = function() {
        content.find('.one-clan-quest').remove();
    };

    this.createOneQuest = function(id, data, $par) {
        var $q = tpl.get('one-clan-quest');
        var f = data.finished;
        var active = data.active == 1 || data.task == 'bring' && !f;
        var task = data.task;

        var status = this.getQuestStatus(active, task, f);
        var kind = Par.tLang(data.task);
        var $where = active == 1 ? '.active-quests' : '.complete-and-unactive-quests';
        var div = data.done / data.todo;

        if (active == 1) $where = '.active-quests';
        else $where = f ? '.complete-quests' : '.unactive-quests';

        $q.addClass(status + ' ' + id);
        $q.find('.quest-header').html(data.title);
        $q.find('.quest-content').html(data.description);
        $q.find('.progress-text').html(kind + ' ' + data.done + ' / ' + data.todo);
        $q.find('.quest-state').html(Par.tLang(status)).addClass(status);
        $q.find('.quest-percent').html((Math.round(div * 100)) + '%');
        //$q.find('.background-bar').css('width', (div * 442) + 'px');
        //$q.find('.background-bar').css('width', (div * 442) + 'px');

        setPercentProgressBar($q.find('.background-bar'), div * 100);

        this.createAllMeasure($q.find('.clan-progress-bar'));

        if (active && isset(data.gold)) this.buyQuest(data.gold, $q);
        if (!f && task == 'bring') this.giveItem(id, data, $q);
        if (task == 'kill') {
            var str = '';
            for (var i = 0; i < data.kill_names.length; i++) {
                str += data.kill_names[i] + ', ';
            }
            var str2 = str.slice(0, str.length - 2);
            var $smallIcon = tpl.get('info-icon').addClass('small-info').tip(str2);
            $q.find('.quest-progress').append($smallIcon);
        }

        $par.find($where).append($q);
    };

    this.createAllMeasure = function($bar) {
        var $measureWrapper = $('<div>').addClass('measure-wrapper');
        for (var i = 0; i < 9; i++) {
            $measureWrapper.append($('<div>').addClass('measure'));
        }
        $bar.append($measureWrapper);
    };

    this.resetLastQuestState = function() {
        lastQuestState = '';
    };

    this.getQuestStatus = function(active, task, finished) {
        if (finished) return 'quest_completed';
        if (active) return 'quest_active';
        return 'quest_unactive';
    };

    this.buyQuest = function(gold, $q) {
        this.createBuyPanel($q, gold);
    };

    this.createBuyPanel = function($parent, gold) {
        var tip = '',
            disable = false,
            canUse = self.canUse(),
            g = round(gold, 5),
            $actionPanel = $parent.find('.right-side');

        if (!canUse) {
            tip += tip != '' ? '<br><br>' : '';
            tip += Par.tLang('clan_quests_can_use');
            disable = true;
        }

        if (Par.getProp('gold') < gold) {
            tip += tip != '' ? '<br><br>' : '';
            tip += _t('notEnoughGold');
            disable = true;
        }

        var cl = !disable ? '' : 'black',
            $btn = tpl.get('button').addClass('small green ' + cl),
            str = Par.tLang('buy_quest') + '<span class="small-money"></span>' + g,
            $questBuyWrapper = $('<div>').addClass('quest-buy-wrapper');

        $btn.tip(tip);
        $btn.find('.label').html(str);
        $questBuyWrapper.append($btn);
        $actionPanel.append($questBuyWrapper);
        if (disable) return;
        $btn.click(self.buyQuestAlert);
    };

    this.canUse = function() {
        var myRank = Par.getProp('myrank');
        return myRank & 1 ? 1 : 0;
    };

    this.buyQuestAlert = function() {
        var bool = self.canUse();
        if (!bool) return;
        _g('clan&a=buy_quest&ans=-1');
    };

    this.giveItem = function(id, data, $parent) {
        var bring = data.task == 'bring';
        if (!bring) return;
        this.createGiveItemPanel(id, data, $parent);
    };

    this.createGiveItemPanel = function(id, data, $parent) {
        var $questBringItemPanel = $parent.find('.quest-bring-item-wrapper');
        var $questBringItem = tpl.get('quest-bring-item');
        $questBringItemPanel.append($questBringItem);

        setOnlyPositiveNumberInInput($questBringItem.find('input'));

        var $inp = $questBringItem.find('input');
        $inp.attr('quest-clan-id', id);
        $inp.focusout(function() {
            var val = parseInt($(this).val());
            if (!val || !Number.isInteger(val) || val < 0) $(this).val('');
        });

        var $but = tpl.get('button').addClass('small green');
        $questBringItem.find('.give-item-btn').append($but);
        $questBringItem.find('.item-wrapper').addClass('item-id-' + data.bring_tpl);
        $but.find('.label').html(Par.tLang('give_item'));
        $but.click(function() {
            self.giveItemAlert($inp);
        });
    };

    this.giveItemAlert = function($input) {
        var v = $input.val();
        if (v == 0) return mAlert(_t('fill_area_how_items'));
        var nr = v > 4 ? 1 : v > 1 ? 2 : 3;
        var str = _t('give_q_item' + nr + ' %amount%', {
            '%amount%': v
        }, 'clan');
        Par.alert(str, function() {
            var id = $input.attr('quest-clan-id');
            _g('clan&a=bring&id=' + id + '&amount=' + v, function() {
                $input.val('');
            });
        });
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.init = function() {
        this.initContent();
        this.initToogleShowBtn();
        this.initFetch();
    };

    this.initQuestHeader = function() {
        //content.find('.quest-header').html(Par.tLang('clan_quests'));
        content.find('.complete-quest-amount').html(_t('finishClanQuests') + ' ' + completQuestAmount + '/' + allQuestsAmount);
        var $span = $('<div>').addClass('small-header-info info-icon');
        $span.tip(_t('one_quest_clan_skill_point'));
        content.find('.complete-quest-amount').append($span);
    };

    this.initFetch = function() {
        //Engine.tpls.fetch('q', self.newBringItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_BRING_CLAN_QUEST_TPL, self.newBringItem);
    };

    this.newBringItem = function(i) {
        content.find('.item-id-' + i.id).each(function() {
            // let $item = Engine.tpls.createViewIcon(i.id, 'bring-item-clan', 'q')[0];
            let $item = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.BRING_ITEM_CLAN_VIEW, 'q')[0];
            $(this).append($item);
        })
    };

    this.initContent = function() {
        content = tpl.get('clan-quests-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    //this.init();

};