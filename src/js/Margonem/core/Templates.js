//const htmlTemplates = require('templates/templates.html');
const TemplatesData = require('@core/TemplatesData');

function Templates() {

    const
        self = this,
        defaultOptions = {
            jQueryObject: true // true/false - jQuery Object or plain HTML
        }
    let options = null;
    let $templates = null;


    this.init = () => {
        //$templates = $(this.doReplaces());
        //this.dataAttr($templates);

        this.prepare();
        this.dataAttr2()
    };

    this.prepare = () => {

        for (let k in TemplatesData) {
            TemplatesData[k] = $(TemplatesData[k]);
        }
    };

    //this.doReplaces = () => {
    //	return htmlTemplates.replaceAll('__LANG', _l());
    //};

    this.mergeOptions = (passedOptions) => {
        options = {
            ...defaultOptions,
            ...passedOptions
        }
    };

    this.getTplOld = (name, passedOptions = {}) => {
        this.mergeOptions(passedOptions);

        var tpl = $templates.find('[data-template="' + name + '"]').clone();
        tpl.addClass(tpl.attr('data-template')).removeAttr('data-template');
        if (!tpl.length) {
            alert('No template found [' + name + ']');
            throw 'No template found [' + name + ']';
        }
        var inside = tpl.find(('[data-template-inside]'));
        if (inside.length > 0) {
            debugger;
            inside.each(function() {
                const $target = $(this);
                var str = 'data-template-inside';
                var val = $target.attr(str);
                var $insideTpl = self.getTpl(val);
                $target.replaceWith($insideTpl)
                console.log(str);
            })
        }

        return options.jQueryObject ? tpl : tpl[0];
    }

    /**
     * html attribute "data-trans" holds data id used to be replaced
     * later in html as translated string. It uses
     * default translation system from core/Translations
     * module
     *
     * possible values:
     * data-trans="key_name" - _t(key_name)
     * data-trans="attr#key_name#catalogue" - _t(key_name, null, catalogue) - will be put in "attr" html attribute
     * data-trans="#key_name#catalogue" - _t(key_name, null, catalogue); (using catalogue but no attr)
     */
    this.getEl = (name) => {
        return this.getTpl(name, {
            jQueryObject: false
        });
    }
    this.getTpl = (name, passedOptions = {}) => {
        this.mergeOptions(passedOptions);

        let tpl = TemplatesData[name];
        if (!tpl) {
            alert('No template found [' + name + ']');
            throw 'No template found [' + name + ']';
        }

        tpl = tpl.clone();

        let inside = tpl.find(('[data-template-inside]'));
        if (inside.length > 0) {
            inside.each(function() {
                let $target = $(this);
                let str = 'data-template-inside';
                let val = $target.attr(str);
                let $insideTpl = self.getTpl(val);

                $target.replaceWith($insideTpl)
                console.log(str);
            })
        }

        return options.jQueryObject ? tpl : tpl[0];
    };

    this.dataAttr = ($all) => {
        if (typeof RUNNING_UNIT_TEST !== 'undefined') return; // _t

        $all.find('[data-trans]').each((i, e) => {
            const $el = $(e);
            var data = $el.attr('data-trans').split('#');
            var tipType = $el.attr('data-tip-type') !== '' ? $el.attr('data-tip-type') : null;
            var value = data[0];
            var attr = null;
            var catalogue = null;

            if (data.length > 1) {
                attr = data[0] ? data[0] : null;
                value = data[1];
                if (typeof(data[2]) != 'undefined') {
                    catalogue = data[2];
                }
            }

            var list = [];
            list.push(value);
            list.push(null);
            if (catalogue) list.push(catalogue);

            if (attr) {

                if (attr == 'data-tip') {
                    $el.tip(_t.apply(null, list), tipType);
                } else {
                    $el.attr(attr, _t.apply(null, list));
                }

            } else $el.html(_t.apply(null, list));

        });
    };

    this.dataAttr2 = () => {
        for (let k in TemplatesData) {
            this.dataAttr(TemplatesData[k]);
        }
    };

}

let templates = new Templates();
templates.init();

module.exports = {
    get: templates.getTpl,
    getEl: templates.getEl
};