var tpl = require('core/Templates');
var Item = require('core/items/Item');
let ProfData = require('core/characters/ProfData');
var TutorialData = require('core/tutorial/TutorialData');
const {
    setOnlyPositiveNumberInInput
} = require('../../HelpersTS');

module.exports = function() {
    var self = this;
    var content;
    var showId = null;
    var allRecipe = {};

    this.recipes = [];
    this.items = {};

    this.init = function() {
        this.initWindow();
        this.initLabels();
        this.initSelect();
        this.initSearch();
        this.initStartLvl();
        this.initStopLvl();
        this.initScrollsBar();
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_RECIPE_TPL, this.newRecipeItem.bind(this));
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 22);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 22);
    };

    this.getShowId = () => {
        return showId;
    }

    this.initStartLvl = function() {
        const $searchWrapper = content.find('.start-lvl-wrapper');
        const $search = createNiInput({
            cl: 'start-lvl',
            placeholder: _t('start'),
            changeClb: self.startFilter,
            clearClb: self.startFilter,
            type: 'number'
        });
        $searchWrapper.html($search);
    };

    this.initStopLvl = function() {
        const $searchWrapper = content.find('.stop-lvl-wrapper');
        const $search = createNiInput({
            cl: 'stop-lvl',
            placeholder: _t('stop'),
            changeClb: self.startFilter,
            clearClb: self.startFilter,
            type: 'number'
        });
        $searchWrapper.html($search);
    };

    this.startFilter = function() {
        content.find('.one-item-on-divide-list').removeClass('hide');
        self.searchKeyUp();
        self.lvlKeyUp();
        self.getValueFromProf();
        self.getValueFromItemType();
        self.countRecipesPerGroup();
        self.updateScroll();
    };

    this.countRecipesPerGroup = () => {
        let $groups = content.find('.divide-list-group');
        $groups.each(function(index, el) {
            let $el = $(el);
            let amount = $el.find('.group-list .one-item-on-divide-list:not(.hide)').length;
            $(el).find('.amount').html(amount);
        });
    };

    this.searchKeyUp = function() {
        var v = content.find('.search').val();
        var $allRecipes = content.find('.one-item-on-divide-list');
        if (v == '') {} else {
            $allRecipes.each(function() {
                var txt = ($(this).find('.name').html()).toLowerCase();
                var disp = txt.search(v.toLowerCase()) > -1 ? true : false;
                disp ? $(this).removeClass('hide') : $(this).addClass('hide');
            });
        }
    };

    this.lvlKeyUp = function() {
        var v1 = content.find('.start-lvl input').val();
        var v2 = content.find('.stop-lvl input').val();
        var $allRecipes = content.find('.one-item-on-divide-list');
        if (v1 == '' && v2 == '') return;
        else {
            if (v1 == '') v1 = 0;
            if (v2 == '') v2 = 1000;
            $allRecipes.each(function() {
                if ($(this).css('display') == 'none') return;
                var lvl = $(this).attr('lvl');
                var disp = lvl >= parseInt(v1) && lvl <= parseInt(v2) ? true : false;
                disp ? $(this).removeClass('hide') : $(this).addClass('hide');
            });
        }
    };

    this.getValueFromProf = function() {
        var val = content.find('.choose-prof').find('.menu-option').attr('value');
        if (val == 'all') return;
        var $allRecipes = content.find('.one-item-on-divide-list');
        $allRecipes.each(function() {
            if ($(this).css('display') == 'none') return;
            var reqp = $(this).attr('reqp');
            var disp = reqp.indexOf(val) > -1 ? true : false;
            disp ? $(this).removeClass('hide') : $(this).addClass('hide');
        });
    };

    this.getValueFromItemType = function() {
        var val = content.find('.choose-item-type').find('.menu-option').attr('value');
        if (val == 'all') return;
        var $allRecipes = content.find('.one-item-on-divide-list');
        $allRecipes.each(function() {
            if ($(this).css('display') == 'none') return;
            var typeItem = $(this).attr('typeitem');
            var disp;
            switch (val) {
                case 'unique':
                    if (typeItem == 'unique' || typeItem == 'heroic' || typeItem == 'legendary') disp = true;
                    else disp = false;
                    break;
                case 'heroic':
                    if (typeItem == 'heroic' || typeItem == 'legendary') disp = true;
                    else disp = false;
                    break;
                case 'legendary':
                    if (typeItem == 'legendary') disp = true;
                    else disp = false;
                    break;
            }
            disp ? $(this).removeClass('hide') : $(this).addClass('hide');
        });
    };


    //const callCheckCanFinishExternalTutorialOpenModule = () => {
    //	let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
    //		TutorialData.ON_FINISH_REQUIRE.OPEN_WINDOW,
    //		TutorialData.ON_FINISH_TYPE.REQUIRE,
    //		Engine.windowsData.name.CRAFTING
    //	);
    //
    //	Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    //};

    this.initWindow = function() {
        content = tpl.get('left-grouped-list-and-right-description-window');
        content.addClass('recipes-manager');


        $('.crafting__contents:first .recipes-content').html(content);

        //callCheckCanFinishExternalTutorialOpenModule();
        //
        // Engine.windowManager.add({
        // 	content           : content,
        // 	title             : _t('crafting', null, 'recipes'),
        // 	nameWindow        : 'Recipes',
        // 	objParent         : this,
        // 	nameRefInParent   : 'wnd',
        // 	startVH           : 60,
        // 	cssVH             : 60,
        // 	onclose: () => {
        // 		this.close();
        // 	}
        // });
        //
        // this.wnd.addToAlertLayer();
    };

    this.initSelect = function() {
        var $r = content;
        var $m = $r.find('.choose-prof');
        var $m2 = $r.find('.choose-item-type');
        var data1 = [{
                val: 'all',
                'text': _t('prof_all', null, 'auction')
            },
            {
                val: ProfData.MAGE,
                'text': _t('prof_mage', null, 'auction')
            },
            {
                val: ProfData.WARRIOR,
                'text': _t('prof_warrior', null, 'auction')
            },
            {
                val: ProfData.PALADIN,
                'text': _t('prof_paladin', null, 'auction')
            },
            {
                val: ProfData.TRACKER,
                'text': _t('prof_tracker', null, 'auction')
            },
            {
                val: ProfData.HUNTER,
                'text': _t('prof_hunter', null, 'auction')
            },
            {
                val: ProfData.BLADE_DANCER,
                'text': _t('prof_bdancer', null, 'auction')
            }
        ];
        $m.createMenu(data1, true, function(pos) {
            self.startFilter();
        });
        var data2 = [{
                val: 'all',
                text: _t('type_all', null, 'auction')
            },
            {
                val: 'unique',
                text: _t('type_unique', null, 'auction')
            },
            {
                val: 'heroic',
                text: _t('type_heroic', null, 'auction')
            },
            {
                val: 'legendary',
                text: _t('type_legendary', null, 'auction')
            }
        ];
        $m2.createMenu(data2, true, function(pos) {
            self.startFilter();
        });
    };

    this.initLabels = function() {
        var $w = content;
        $w.find('.receipe-header-label').html(this.tLang('recipe'));
        $w.find('.reagents-label').html(this.tLang('reagents_recipe'));
        $w.find('.left-column-list-label').html(this.tLang('list_recipes'));
        //$w.find('.reagents-label').html(this.tLang('reagents_recipe')).attr('name', this.tLang('reagents_recipe'));
        //$w.find('.receipe-list-label').html(this.tLang('list_recipes')).attr('name', this.tLang('list_recipes'));
        $w.find('.empty').html(this.tLang('recipse_info'));
    };

    this.initScrollsBar = function() {
        $('.left-scroll', content).addScrollBar({
            track: true
        });
        $('.right-scroll', content).addScrollBar({
            track: true
        });
    };

    this.updateScroll = function() {
        $('.left-scroll', content).trigger('update');
        $('.right-scroll', content).trigger('update');
    };

    this.createRecipesList = function(recipeData, id, categorySort, nameSortAllCategory) {
        var enabled = recipeData.enabled ? 'enabled' : 'disabled';
        var $one = tpl.get('one-item-on-divide-list').addClass('crafting-recipe-in-list ' + enabled);
        $one.addClass(`recipe-id-${id}`);
        $one.find('.name').html(recipeData.name);
        self.appendRecipeToGroup($one, recipeData.itemTpl, categorySort, nameSortAllCategory, recipeData.enabled);
        this.recipeClick($one, id);
    };

    this.appendRecipeToGroup = function($recipe, tplId, categorySort, nameSortAllCategory, enabled) {
        // const item = Engine.tpls.getTplByIdAndLoc(tplId, 'c')
        const item = Engine.tpls.getTplByIdAndLoc(tplId, Engine.itemsFetchData.NEW_RECIPE_TPL.loc)

        let reqp = 'all';
        let typeItem = 'all';
        let cls = ['unique', 'heroic', 'legendary'];
        let itemCl = item.cl;
        let stats = item._cachedStats;

        if (isset(stats.lvl)) $recipe.attr('lvl', stats.lvl);
        if (isset(stats.reqp)) reqp = stats.reqp;

        for (const cl of cls) { // @ToDo - remove this loop after rarity changes
            if (item.itemTypeName === cl) typeItem = cl;
        }

        $recipe.attr('typeItem', typeItem);
        $recipe.attr('reqp', reqp);

        if (!isset(nameSortAllCategory[itemCl])) {
            nameSortAllCategory[itemCl] = {
                enabled: [],
                disabled: []
            };
        }
        if (enabled) nameSortAllCategory[itemCl].enabled.push($recipe);
        else nameSortAllCategory[itemCl].disabled.push($recipe);
    };

    this.createGroupElement = function(cl, $recipe) {
        var $recipeGroup = content.find('.group-' + cl);
        let $recipeGroupHeader;
        if ($recipeGroup.length < 1) {
            $recipeGroup = tpl.get('divide-list-group');
            $recipeGroupHeader = $recipeGroup.find('.group-header');
            //$recipeGroup.attr('index', cl);
            $recipeGroup.addClass(`group-${cl} active`);
            $recipeGroup.find('.label').html(_t('au_cat' + cl, null, 'auction'));
            content.find('.items-list').append($recipeGroup);
            $recipeGroupHeader.click(function() {
                $recipeGroup.toggleClass('active');
                self.updateScroll();
            });
        }
        $recipeGroup.find('.group-list').append($recipe);
    };

    this.createRecipe = function(recipeData, id) {
        var $header = tpl.get('crafting-description-header');
        var $reagents = tpl.get('crafting-description-reagents');
        var $button = tpl.get('crafting-description-button');

        this.createResultItem($header, recipeData.itemTpl);
        this.useRecipeBtn($button, recipeData.enabled);
        this.createReagents($reagents, recipeData);
        $header.find('.offer-name').html(recipeData.name);
        if (allRecipe[id]) delete allRecipe[id];
        allRecipe[id] = {
            'header': $header,
            'reagents': $reagents,
            'button': $button
        }
    };

    this.createResultItem = function(recipe, tplId) {
        const $icon = this.getRecipeIcon(tplId);
        const $itemSlot = recipe.find('.result-item');
        $itemSlot.append($icon);
    };

    this.createReagents = function(recipe, recipeData) {
        var ingredients = recipeData.ingredients;
        var miss = recipeData.missing;
        for (const ingredient of ingredients) {
            const [tplId, amount] = ingredient;
            const item = this.items[tplId];
            let have;
            const $reagent = tpl.get('crafting-reagent');
            const $itemSlot = $reagent.find('.item-slot');
            const foundMiss = miss && miss.find(el => el[0] === tplId);
            if (foundMiss) {
                const [missTplId, missAmount] = foundMiss;
                $reagent.find('.amount-items').addClass('disabled');
                have = amount - missAmount;
            } else {
                have = amount;
            }
            $reagent.find('.have').html(have);
            $reagent.find('.need').html(amount);
            $reagent.find('.item-name').html(item.name);
            recipe.find('.reagents-list').append($reagent);

            const $icon = this.getRecipeIcon(tplId);
            $itemSlot.append($icon)
        }
    };

    this.cleanList = function() {
        var $w = content;
        $w.find('.recipe-description').remove();
        $w.find('.crafting-recipe-in-list').remove();
        $w.find('.empty').css('display', 'block');
    };

    this.useRecipeBtn = function(recipe, canUse) {
        var $btn = tpl.get('button').addClass('small');
        var enabled = canUse ? 'green' : 'black';
        var str = this.tLang('use_recipe');
        $btn.addClass(enabled);
        $btn.find('.label').html(str);
        recipe.find('.use-recipe-btn').append($btn);
    };

    this.confirmUseRecipe = function(id) {
        _g('craft&a=use&id=' + id, function() {
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 24);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 24);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 25);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 25);

            self.callCheckCanFinishExternalTutorialUseRecipe(id);
        });


    };

    this.callCheckCanFinishExternalTutorialUseRecipe = (idRecipe) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.USE_RECIPE,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            idRecipe
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger)
    };

    this.callCheckCanFinishExternalTutorialClickRecipeOnList = (idRecipe) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.CLICK_RECIPE_ON_LIST,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            idRecipe
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger)
    };

    this.recipeClick = function(recipe, id) {
        recipe.click(function(e) {
            e.stopPropagation();
            self.showRecipe(id);
            self.callCheckCanFinishExternalTutorialClickRecipeOnList(id);
        });
    };

    this.showRecipe = function(id) {
        var $w = content;
        var o = allRecipe[id];
        showId = id;

        $w.find('.mark-offer').removeClass('mark-offer');
        $w.find('.recipe-id-' + id).addClass('mark-offer');
        $w.find('.board').css('display', 'block');
        $w.find('.right-column-header .crafting-description-header').detach();
        $w.find('.right-column-header').html(o.header);
        $w.find('.all-items-wrapper .crafting-description-reagents').detach();
        $w.find('.all-items-wrapper').html(o.reagents);
        $w.find('.do-recipe').html(o.button);
        self.updateScroll();
        var $b = content.find('.use-recipe-btn>.button');
        if ($b.hasClass('black')) return;
        $b.off("click");
        $b.click(function() {
            self.confirmUseRecipe(id);
        });
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 23, $b);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 23, $b);
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 24);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 24);
    };

    this.initSearch = function() {
        var $searchInput = content.find('.search'),
            $searchX = content.find('.search-x');
        $searchInput.keyup(function() {
            self.startFilter()
        });
        $searchInput.attr('placeholder', _t('search'));

        $searchX.on('click', function() {
            $searchInput.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.getRecipeIcon = function(tplId) {
        return Engine.tpls.createViewIcon(tplId, Engine.itemsViewData.RECIPE_ITEM_VIEW, Engine.itemsFetchData.NEW_RECIPE_TPL.loc)[0];
    };

    this.newRecipeItem = function(item, finish) {
        this.items[item.id] = item;
        item.$.on("contextmenu", function(e) {
            item.createOptionMenu(e);
        });
        if (finish) {
            this.createAllRecipes();
        }
    };

    this.update = function(v) {
        this.recipes = v;
    };

    this.createAllRecipes = function() {
        let categorySort = {};
        let nameSortAllCategory = {};
        this.cleanList();
        for (let id in this.recipes) {
            var recipeData = this.recipes[id];

            this.createRecipesList(recipeData, id, categorySort, nameSortAllCategory);
            this.createRecipe(recipeData, id);
        }

        for (let k in nameSortAllCategory) {
            let oneCategory = nameSortAllCategory[k];

            oneCategory.enabled.sort(function(a, b) {
                let nA = $(a).find('.name').html();
                let nB = $(b).find('.name').html();
                return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
            });

            oneCategory.disabled.sort(function(a, b) {
                let nA = $(a).find('.name').html();
                let nB = $(b).find('.name').html();
                return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
            });

            for (let e2 in oneCategory.enabled) {
                self.createGroupElement(k, oneCategory.enabled[e2]);
            }

            for (let e1 in oneCategory.disabled) {
                self.createGroupElement(k, oneCategory.disabled[e1]);
            }
        }

        if (showId !== null) self.showRecipe(showId);
        this.countRecipesPerGroup();
        this.updateScroll();
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 23);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 23);

        Engine.crafting.wnd.updateWindowTrigger();

        //Engine.tutorialManager.tutorialStart('pl', 24);
        //Engine.tutorialManager.tutorialStart('en', 24);
    };

    this.deleteRecipes = function() {
        for (var k in allRecipe) {
            var r = allRecipe[k];
            delete allRecipe[k];
            r.header.remove();
            r.reagents.remove();
            r.button.remove();
        }
    };

    this.close = function() {
        //content.remove();
        self.deleteRecipes();
        allRecipe = null;
        this.recipes = [];
        this.items = {};
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_RECIPE_TPL);
        // Engine.tpls.deleteMessItemsByLoc('c');
        Engine.tpls.deleteMessItemsByLoc(Engine.itemsFetchData.NEW_RECIPE_TPL.loc);
        Engine.crafting.recipes = false;
        //delete (self.wnd);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 26);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 26);
        //delete(self);
    };

    this.tLang = function(name) {
        return _t(name, null, 'recipes');
    };

    //this.init();
};