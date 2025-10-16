var StorageFuncWindow = require('@core/window/StorageFuncWindow');
const {
    copyToClipboard
} = require('../../HelpersTS');

module.exports = function() {
    const
        //addonKey = 'addon_27',
        addonKey = Engine.windowsData.name.addon_27,
        addonName = _t('title', null, 'item_frames'),
        defaultFramesAmount = 7,
        itemTypesAmount = 6,
        frameSize = 32,
        defaultFramesUrl = '../img/gui/item_frames/frames/item_frames.png',
        defaultOverlaysUrl = [
            '',
            '/img/gui/item_frames/overlays/1.png',
            '/img/gui/item_frames/overlays/2.png',
            '/img/gui/item_frames/overlays/3.png',
            '/img/gui/item_frames/overlays/4.png',
            '/img/gui/item_frames/overlays/5.png',
            '/img/gui/item_frames/overlays/6.png',
        ],
        itemUrl = `${CFG.a_ipath}nas/naswilka5.gif`,
        removeText = _t('delete', null, 'buttons'),
        copyText = _t('copy', null, 'item_id'),
        tabs = {
            frames: "frames",
            overlays: "overlays",
        };

    let bgPosY = '',
        bgUrl = '',
        overlayUrl = '',
        // open = false,
        running = false,
        hwnd = null;


    Vue.directive('click-outside', {
        bind: function(el, binding, vnode) {
            el.clickOutsideEvent = function(event) {
                // check that click was outside the el and his children
                if (!(el == event.target || el.contains(event.target))) {
                    // call method provided in attribute value
                    vnode.context[binding.expression](event);
                }
            };
            document.body.addEventListener('mousedown', el.clickOutsideEvent)
        },
        unbind: function(el) {
            document.body.removeEventListener('mousedown', el.clickOutsideEvent)
        },
    });

    Vue.directive('add-tip', {
        bind: function(el, binding, vnode) {
            $(el).tip(binding.value);
        }
    });

    const app = new Vue({
        template: `
            <div>
                <div class="item-frames__content">
                    <tw-tabs @changeTab="changeTab">
                        <div class="c-line mt-1 mb-1"></div>
                        <tw-tab title="${_t(tabs.frames, null, 'item_frames')}" slug="${tabs.frames}" selected>
                          <div class="scroll-wrapper classic-bar">
                            <div class="scroll-pane">
                                <div class="scroll-pane-content">
                                    <div class="item-frames__list">
                                        <div v-for="item in frameList" class="item-frames__list-el tw-list-item" @click="framesOnClick(item)" :class="{ active: item.active }">
                                            <div class="item-frames__overview">
                                                <div v-for="(n, i) in ${itemTypesAmount}" :key="n" class="item-frames__overview-one" :style="getStyles(item, i)">
                                                  <img src="${itemUrl}">
                                                </div>
                                            </div>
                                            <div class="item-frames__remove" v-if="item.source === 'outer'" @click.stop="removeOnClick(item)" v-add-tip="'${removeText}'"></div>
                                            <div class="item-frames__copy copy-btn" v-if="item.source === 'outer'" @click.stop="copyOnClick(item.url)" v-add-tip="'${copyText}'"></div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </tw-tab>
                        <tw-tab title="${_t(tabs.overlays, null, 'item_frames')}" slug="${tabs.overlays}">
                          <div class="scroll-wrapper classic-bar">
                            <div class="scroll-pane">
                                <div class="scroll-pane-content">
                                    <div class="item-frames__list">
                                        <div v-for="item in overlayList" class="item-frames__list-el tw-list-item" @click="overlayOnClick(item)" :class="{ active: item.active }">
                                            <div class="item-frames__overview">
                                                <div v-for="(n, i) in ${itemTypesAmount}" :key="n" class="item-frames__overview-one" :style="getStyles(getActiveFrame(), i)">
                                                  <img src="${itemUrl}">
                                                  <div class="item-frames__overlay" :style="getOverlayStyles(item, i)"></div>
                                                </div>
                                            </div>
                                            <div class="item-frames__remove" v-if="item.source === 'outer'" @click.stop="removeOnClick(item)" v-add-tip="'${removeText}'"></div>
                                            <div class="item-frames__copy copy-btn" v-if="item.source === 'outer'" @click.stop="copyOnClick(item.url)" v-add-tip="'${copyText}'"></div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                          </div>
                        </tw-tab>
                    </tw-tabs>
                </div>
                <ifc-adder @addFrame="addFrame"></ifc-adder>
            </div>
        `,
        data: {
            frameList: [],
            overlayList: [],
            activeTab: tabs.frames
        },
        mounted() {
            this.frameList = !this.checkFramesDataIsset() ? this.createDefaultFrameList() : this.getSavedFrames();
            this.overlayList = !this.checkOverlaysDataIsset() ? this.createDefaultOverlayList() : this.getSavedOverlays();
            this.setFramesOnItems(this.getActivePreset);
            this.setOverlaysOnItems(this.getActiveOverlay);
        },
        updated() {
            scrollBarUpdate();
        },
        computed: {
            getActivePreset: function() {
                return this.frameList.filter((p) => p.active === true)[0];
            },
            getActiveOverlay: function() {
                return this.overlayList.filter((p) => p.active === true)[0];
            }
        },
        methods: {
            getSavedFrames() {
                return Engine.serverStorage.get(addonKey, "framesTab");
            },
            getSavedOverlays() {
                return Engine.serverStorage.get(addonKey, "overlaysTab");
            },
            createDefaultFrameList() {
                let defData = [];
                for (let i = 0; i < defaultFramesAmount; i++) {
                    defData.push({
                        source: 'inner',
                        offset: i,
                        active: (i === 0)
                    });
                }
                return defData;
            },
            createDefaultOverlayList() {
                let defData = [];
                for (let i = 0; i < defaultOverlaysUrl.length; i++) {
                    defData.push({
                        source: 'inner',
                        url: defaultOverlaysUrl[i],
                        active: (i === 0)
                    });
                }
                return defData;
            },
            checkFramesDataIsset() {
                let data = this.getSavedFrames();
                return !(data === null || data.length === 0);
            },
            checkOverlaysDataIsset() {
                let data = this.getSavedOverlays();
                return !(data === null || data.length === 0);
            },
            getStyles(item, index) {
                return {
                    'background-image': `url('${ item.url ? item.url : defaultFramesUrl }')`,
                    'background-position': `${-(index*frameSize)}px ${-(item.offset * frameSize)}px`
                };
            },
            getOverlayStyles(item, index) {
                return {
                    'background-image': `url('${ isset(item.url) ? item.url : defaultFramesUrl }')`,
                    'background-position': `${-(index*frameSize)}px ${-(index*frameSize)}px`
                };
            },
            getBackground(item) {
                return `url('${ item.url ? item.url : defaultFramesUrl }')`;
            },
            framesOnClick(item) {
                this.setActiveFrame(item);
                this.saveData();
                this.setFramesOnItems(item);
            },
            overlayOnClick(item) {
                this.setActiveOverlay(item);
                this.saveData();
                this.setOverlaysOnItems(item);
            },
            setFramesOnItems(item) {
                bgPosY = -(item.offset * frameSize) + 'px';
                bgUrl = item.url ? item.url : defaultFramesUrl;

                Engine.map.groundItems.changeFrames(bgUrl, item.offset);
                reloadStyles();
            },
            setOverlaysOnItems(item) {
                overlayUrl = item.url;

                Engine.map.groundItems.changeOverlays(overlayUrl);
                reloadStyles();
            },
            setActiveFrame(item) {
                this.frameList.map(it => it.active = it === item);
            },
            getActiveFrame() {
                return this.frameList.find(it => it.active === true);
            },
            setActiveOverlay(item) {
                this.overlayList.map(it => it.active = it === item);
            },
            addFrame(url) {
                if (this.activeTab === tabs.frames) {
                    const frameData = {
                        source: 'outer',
                        offset: 0,
                        active: false,
                        url
                    };
                    this.frameList.push(frameData);
                    this.setActiveFrame(frameData);
                    this.setFramesOnItems(frameData);
                } else {
                    const overlayData = {
                        source: 'outer',
                        url,
                        active: false
                    };
                    this.overlayList.push(overlayData);
                    this.setActiveOverlay(overlayData);
                    this.setOverlaysOnItems(overlayData)
                }
                this.saveData();
                scrollToBottom();
            },
            saveData(callback) {
                Engine.serverStorage.sendData({
                    [addonKey]: {
                        framesTab: this.frameList,
                        overlaysTab: this.overlayList
                    }
                }, callback)
            },
            removeOnClick(item) {
                const confirmMsgKey = this.activeTab === tabs.frames ? 'remove_confirm' : 'remove_overlay_confirm';
                const callbacks = [{
                        txt: _t('yes', null, 'buttons'),
                        callback: () => {
                            this.activeTab === tabs.frames ? this.removeFrame(item) : this.removeOverlay(item);
                            return true;
                        }
                    },
                    {
                        txt: _t('no', null, 'buttons'),
                        callback: () => {
                            return true;
                        }
                    }
                ];
                mAlert(_t(confirmMsgKey, null, 'item_frames'), callbacks);

                return false;
            },
            copyOnClick(url) {
                copyToClipboard(url);
            },
            removeFrame(item) {
                const index = this.frameList.indexOf(item);
                if (item.active) {
                    const prevItem = this.frameList[index - 1];
                    this.setActiveFrame(prevItem);
                    this.setFramesOnItems(prevItem);
                }
                this.frameList.splice(index, 1);
                this.saveData();
            },
            removeOverlay(item) {
                const index = this.overlayList.indexOf(item);
                if (item.active) {
                    const prevItem = this.overlayList[index - 1];
                    this.setActiveOverlay(prevItem);
                    this.setOverlaysOnItems(prevItem);
                }
                this.overlayList.splice(index, 1);
                this.saveData();
            },
            changeTab(tabSlug) {
                this.activeTab = tabSlug;
            }
        }
    });

    Vue.component('ifc-adder', {
        template: `
        <div class="window-controlls" style="display:block" v-click-outside="clearAndHide">
            <div class="row row-input tw-list-item" :class="{ active: inputShow }">
                <div class="input-wrapper">
                    <input class="default" :placeholder="placeholder" v-model="value" @keyup.enter="addNew" ref="addInput">
                </div>
            </div>
            <div class="row row-add tw-list-item" @click="addNew">
                <div class="add do-action-cursor">
                    <div class="btn-add">+</div>
                </div>
            </div>
        </div>
        `,
        data: function() {
            return {
                inputShow: false,
                value: '',
                placeholder: _t('input_label', null, 'item_frames')
            }
        },
        methods: {
            addNew() {
                if (this.inputShow) {
                    if (this.value === '') {
                        this.inputShow = false;
                    } else {
                        this.save();
                    }
                } else {
                    this.inputShow = true;
                    this.focusAddInput()
                }

            },
            checkHttps(val) {
                if (!val.startsWith('https://') || val == 'https://') {
                    message(_t('https_alert', null, 'item_frames'));
                    return false;
                }
                return true;
            },
            save() {
                if (!this.checkHttps(this.value)) return;
                this.$emit('addFrame', this.value);
                this.clearAndHide();
            },
            focusAddInput() {
                this.$nextTick(() => {
                    this.$refs.addInput.focus();
                });
            },
            clearAndHide() {
                this.value = '';
                this.inputShow = false;
            }
        }
    });

    Vue.component('tw-tabs', {
        template: `
          <div>
              <div class="tw-tabs">
                <div
                    v-for="(tab, index) in tabs"
                    :key="index"
                    class="do-action-cursor"
                    :class="{ 'is-active': tab.isActive }"
                    @click="selectTab(tab)">{{ tab.title }}</div>
              </div>
              <div class="tw-tab-content">
                <slot></slot>
              </div>
          </div>
        `,
        data() {
            return {
                tabs: []
            };
        },
        created() {
            this.tabs = this.$children;
        },
        methods: {
            selectTab(selectedTab) {
                this.tabs.forEach(tab => {
                    tab.isActive = tab === selectedTab;
                    if (tab.isActive) {
                        this.$emit('changeTab', tab.slug)
                    }
                });
            }
        }
    });

    Vue.component('tw-tab', {
        template: `
          <div v-show="isActive">
            <slot></slot>
          </div>
        `,
        props: {
            title: {
                type: String,
                required: true
            },
            slug: {
                type: String,
                required: true
            },
            selected: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isActive: false
            };
        },
        mounted() {
            this.isActive = this.selected;
        },
        watch: {
            isActive() {
                this.$nextTick(() => {
                    scrollBarUpdate();
                });
            }
        }
    });


    function initWindow() {


        hwnd = Engine.windowManager.add({
            content: $(`<div id="${addonKey}"></div>`),
            title: addonName,
            nameWindow: addonKey,
            widget: Engine.widgetsData.name.addon_27,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            manageShow: false,
            managePosition: {
                'x': 251,
                'y': 60
            },
            onclose: () => {
                closeWnd();
                // open = false;
                // API.Storage.set(`${addonKey}/show`, false);
            }
        });

        hwnd.el = hwnd.$[0];
        // closeWnd();
        hwnd.el.classList.add('item-frames');
        hwnd.updatePos();
        hwnd.addToAlertLayer();

        const component = document.getElementById(addonKey);
        app.$mount(component);
    }

    function scrollBarUpdate() {
        hwnd.$.find('.scroll-wrapper').trigger('update');
    }

    function scrollToBottom() {
        hwnd.$.find('.scroll-wrapper').trigger('scrollBottom');
    }

    function addScrollbar() {
        // hwnd.$.find('.scroll-wrapper').addScrollBar({ track: true });
        hwnd.$.find('.scroll-wrapper').each(function() {
            $(this).addScrollBar({
                track: true
            });
        });
    }

    function reloadStyles() {
        removeStyles();
        addStyles();
    }

    function addStyles() {
        const styleEl = stringToHtml(style());
        document.head.appendChild(styleEl);
    }

    function removeStyles() {
        const styleEl = document.getElementById(`${addonKey}-style`);
        if (!!styleEl) {
            styleEl.parentNode.removeChild(styleEl);
        }

    }

    function openWnd() {
        hwnd.show();
    }

    function closeWnd() {
        hwnd.hide();
    }

    this.manageVisible = function() {
        // open = !open;
        if (hwnd.isShow()) closeWnd();
        else {
            openWnd();
            hwnd.setWndOnPeak();
            scrollBarUpdate();
        }

        // API.Storage.set(`${addonKey}/show`, open);
    };

    this.start = function() {
        if (running) return;
        running = true;

        addStyles();
        initWindow();

        // if (StorageFuncWindow.getShowWindow(addonKey)) {
        // if (API.Storage.get(`${addonKey}/show`, false)) {
        //     openWnd();
        // open = true;
        // }
        addScrollbar();
    };

    this.stop = function() {
        if (!running) return;
        running = false;
        hwnd.remove();
        hwnd = null;
        removeStyles();
        Engine.map.groundItems.changeFrames(defaultFramesUrl, 0);
        Engine.map.groundItems.changeOverlays(null);
        Engine.serverStorage.clearDataBySpecificKey(addonKey);
    };

    const style = () => `
        <style id="${addonKey}-style">
            .item-frames {
                
            }
            .item-frames .content {
                margin-top: -15px;
                margin-left: -23px;
                margin-right: -23px;
                margin-bottom: -18px;
            }
            .item-frames__content {
                margin-top: 10px;
                position: relative;
            }
            .item-frames__list {
            
            }
            .item-frames__list-el {
                padding: 3px 2px;
                position: relative;
                overflow: hidden;
            }
            .item-frames__list-el[data-source='inner'] .item-frames__remove {
                display: none;
            }
            .item-frames__list-el:last-child {
                margin-bottom: 1px;
            }
            .item-frames__list-el.active {
                /*border: 1px solid rgba(52,153,64,1);*/
                box-shadow: 0 0 0 2px rgba(52,153,64,1) inset, 0 0 0 1px rgba(0, 0, 0, 0.55);
            }
            .item-frames__overview {
                display: flex;
            }
            .item-frames__overview-one {
                width: 32px;
                height: 32px;
                margin-left: 1px;
                position: relative;
            }
            .item-frames__remove {
                background: url(../img/gui/buttony.png?v=6) -624px -117px;
                width: 12px;
                height: 12px;
                position: absolute;
                top: 3px;
                right: 4px;
            }
            .item-frames__remove:hover {
                background: url(../img/gui/buttony.png?v=6) -726px -117px;
            }
            .item-frames__copy {
                position: absolute;
                bottom: 4px;
                right: 4px;
            }
            .item-frames__overlay {
                position: absolute;
                left: 0;
                top: 0;
                width: 32px;
                height: 32px;
            }
            .item-frames .scroll-wrapper .scroll-pane {
                max-height: 50vh;
                padding: 0 3px;
            }
            .item-frames .scroll-wrapper.scrollable .scroll-pane {
                margin-right: 15px;
                padding-right: 3px;
            }
            .item-frames .scroll-wrapper.scrollable .scrollbar-wrapper {
                right: 0;
                top: 0;
                bottom: 1px;
            }
            .item-frames .row {
                font-size: 11px;
                height: 22px;
                color: white;
            }
            .item-frames .window-controlls {
                margin-top: 2px;
                padding: 0 3px;
            }
            .item-frames .window-controlls .add {
                overflow: hidden;
            }
            .item-frames .row-input {
                display: none;
            }
            .item-frames .row-input.active {
                display: block;
            }
            .item-frames .input-wrapper input {
                height: 12px;
                color: white;
                vertical-align: 0;
                font-size: 11px;
                width: 96%;
            }
            .item .highlight.h-exist, 
            .bottomItem .highlight.h-exist, 
            .item .icon.h-exist, 
            .bottomItem .icon.h-exist {
                ${ bgPosY !== '' ? `background-position-y: ${bgPosY} !important;` : ''}
                ${ bgUrl !== '' ? `background-image: url(${bgUrl});` : ''}
                &::after {
                  content: '';
                  position: absolute;
                  left: 0; top: 0; right: 0; bottom: 0;
                  z-index: 1;
                  ${ overlayUrl !== '' ? `background-image: url(${overlayUrl});` : ''}
                }
                [data-upgrade="0"] &::after { background-position-y: -32px; }
                [data-upgrade="1"] &::after { background-position-y: -64px; }
                [data-upgrade="2"] &::after { background-position-y: -96px; }
                [data-upgrade="3"] &::after { background-position-y: -128px; }
                [data-upgrade="4"] &::after { background-position-y: -160px; }
                [data-upgrade="5"] &::after { background-position-y: -192px; }
                
                [data-item-type="t-uniupg"] &::after { background-position-x: -32px; }
                [data-item-type="t-her"] &::after { background-position-x: -64px; }
                [data-item-type="t-upgraded"] &::after { background-position-x: -96px; }
                [data-item-type="t-leg"] &::after { background-position-x: -128px; }
                [data-item-type="t-art"] &::after { background-position-x: -160px; }
            }
        </style>
    `;

};