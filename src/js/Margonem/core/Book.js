// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function() {
    var self = this;
    var content;
    var amountPages;
    var pages;
    var visPage;

    this.init = function() {
        self.initWindow();
        self.initButtons();
        self.wnd.center();
        // Engine.lock.add('book');
    };

    this.initButtons = function() {
        var w = this.wnd.$;
        w.find('.prev').click(function() {
            self.changePage(-1)
        });
        w.find('.next').click(function() {
            self.changePage(1)
        });
    };

    this.updateData = function(v) {
        this.updateVars(v.content);
        this.updateHeader(v.title, v.author);
        this.updateBookInfo();
        this.showPage();
    };

    this.updateVars = function(content) {
        pages = content.split('#PAGE#');
        visPage = 1;
        amountPages = pages.length;
    };

    this.updateHeader = function(title, author) {
        var w = this.wnd.$;
        w.find('.book-title').html(parseContentBB(title));
        w.find('.author').html(parseContentBB(author));
    };

    this.updateBookInfo = function() {
        var w = this.wnd.$;
        w.find('.which').html(visPage);
        w.find('.amount').html('/' + amountPages);
    };

    this.changePage = function(d) {
        visPage = Math.max(1, Math.min(amountPages, visPage + d));
        this.showPage();
        this.updateBookInfo();
    };

    this.showPage = function() {
        var w = this.wnd.$;
        w.find('.left').html(parseContentBB(pages[visPage - 1]));
    };

    this.initWindow = function() {
        // this.wnd = new wnd({
        // 	onclose: function () {
        // 		self.close();
        // 	}
        // });
        // var title = _t('book', null, 'book');
        // this.wnd.title(title);
        content = tpl.get('book');
        // this.wnd.content(content);
        // $('.alerts-layer').append(this.wnd.$);


        Engine.windowManager.add({
            content: content,
            title: _t('book', null, 'book'),
            //nameWindow        : 'book',
            nameWindow: Engine.windowsData.name.BOOK,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                self.close();
            }
        });
        this.wnd.addToAlertLayer();

    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        //delete (self.wnd);
        // Engine.lock.remove('book');
        Engine.book = false;
        //delete(self);
    };

    //this.init();
};