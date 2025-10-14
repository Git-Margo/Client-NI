module.exports = function() {

    this.active = false;
    this.blink = false;
    this.val = 0;
    this.maxVal = 3.14;
    this.target = [];

    this.init = () => {

    };

    this.addMultiGlowTarget = (selectorArray, blink) => {
        this.setBlink(blink);
        let alpha = this.blink ? this.getAlpha() : 1;

        for (let i = 0; i < selectorArray.length; i++) {

            //selectorArray[i].

            let isObject = typeof selectorArray[i] === "object";

            let $el = isObject ? selectorArray[i] : $(selectorArray[i]);


            if (!$el.length) {
                console.warn('[HtmlMultiGlow.js, addMultiGlowTarget] Not exist element: ', selectorArray[i]);
                continue
            }
            //let newIndex = this.getNewTargetId();
            //this.addTarget($el);
            //this.setAlpha(newIndex, alpha);

            this.addTargetWhenAttachToBody($el, alpha);
        }


        this.setActive(true);
    };

    this.addTargetWhenAttachToBody = ($el, alpha) => {
        if (!$el.parent().length) {
            setTimeout(() => {
                this.addTargetWhenAttachToBody($el, alpha);
            }, 500);
            return;
        }
        let newIndex = this.getNewTargetId();
        this.addTarget($el);
        this.setAlpha(newIndex, alpha);
    };

    this.getNewTargetId = () => {
        return this.target.length;
    };

    this.update = (dt) => {
        if (!this.active || !this.target.length) return;

        this.val += dt;
        if (this.val > this.maxVal) this.val = 0;

        let alpha = this.getAlpha();

        if (this.blink) {
            for (let i = 0; i < this.target.length; i++) {
                this.setAlpha(i, alpha);
            }
        }
    };

    this.getAlpha = () => {
        return Math.round(Math.sin(this.val) * 100) / 100;
    };

    this.setBlink = (state) => {
        this.blink = state ? true : false;
    };

    this.setAlpha = (index, alpha) => {
        if (this.target[index].css('border-left-width')) {
            this.target[index].css('box-shadow', '0px 0px 20px ' + alpha * 5 + 'px rgba(62, 209, 222, ' + alpha + ')');
        } else {
            this.target[index].css('box-shadow', 'inset 0px 0px 8px ' + alpha * 5 + 'px rgba(62, 209, 222, ' + alpha + '), 0px 0px 20px 0 rgba(62, 209, 222, ' + alpha + ')');
        }
    };

    this.addTarget = ($target) => {
        this.target.push($target);
        $target.addClass('multi-glow-target');
    };

    this.clearTarget = () => {
        for (let i = 0; i < this.target.length; i++) {
            let $target = this.target[i];
            $target.removeClass('multi-glow-target');
            //$target.css('box-shadow', 'none');
            $target[0].style.boxShadow = '';
        }
        this.target = [];
    };

    this.removeMultiGlowTarget = () => {
        if (!this.getActive()) return;

        this.clearTarget();
        this.setBlink(false);
        this.setActive(false);
    };

    this.setActive = (active) => {
        this.active = active;
    };

    this.getActive = () => {
        return this.active;
    };

};