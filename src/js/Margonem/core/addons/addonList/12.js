module.exports = function() {

    const
        //addonKey = 'addon_12',
        addonKey = Engine.windowsData.name.addon_12,
        addonName = _t("title", null, "map_items"),
        removeText = _t('delete', null, 'buttons'),
        searchText = _t('search');
    //FETCH_WATCH_ITEM = {loc: 'm', k:'FETCH_WATCH_ITEM'}


    let running = false,
        // open = false,
        hwnd = null,
        itemIsNpc = false;

    Vue.directive('add-item', {
        bind: function(el, binding, vnode) {
            el.innerHTML = '';
            el.appendChild(binding.value[0]);
        },
        // update: function (el, binding, vnode) { // fix for update element (e.g. delete item)
        // 	el.innerHTML = '';
        // 	el.appendChild(binding.value[0]);
        // }
    });

    Vue.directive('add-tip', {
        bind: function(el, binding, vnode) {
            $(el).tip(binding.value);
        }
    });

    Vue.directive('add-npc-tip', {
        bind: function(el, binding, vnode) {
            let id = binding.value.id;
            let npc = Engine.npcs.getById(id);

            if (!npc) {
                return;
            }

            let view = binding.value.view;
            let tip = Engine.npcs.getTip(npc);
            let icon = createNpcIcon("tip-npc-wrapper", "tip-npc-icon", view, 1, 32, 32, 190);

            $(el).tip(tip + icon);
        }
    });

    const app = new Vue({
        template: `
			<div class="window-list map-item">
				<div class="scroll-wrapper classic-bar">
					<div class="scroll-pane">
						<div class="scroll-pane-content">
							<div class="list item-list">
								<div v-if="filteredList.length > 0">
									<gi-item 
										v-for="item in filteredList"
										:item="item" 
										:key="item.id" 
										class="map_item_table do-action-cursor tw-list-item">
									</gi-item>
								</div>
								<div v-else class="empty">----</div>
							</div>
						</div>
					</div>
				</div>
				<div class="search-wrapper scrollable">
					<input class="search map-item-search-input" placeholder="${searchText}" v-model="searchValue">
					<div class="search-x" @click="searchClear" v-add-tip="'${removeText}'"></div>
				</div>
			</div>
        `,
        data: {
            list: [],
            searchValue: ''
        },
        mounted() {
            let self = this;
            API.addCallbackToEvent(Engine.apiData.NEW_NPC, this.watchNpc);
            API.addCallbackToEvent(Engine.apiData.REMOVE_NPC, function(e) {
                self.removeItem(e.d.id);
            });
            API.addCallbackToEvent(Engine.apiData.CLEAR_MAP_NPCS, this.removeAllItems);
            Engine.items.fetch(Engine.itemsFetchData.FETCH_WATCH_ITEM, this.watchItem);
        },
        updated() {
            scrollBarUpdate();
        },
        destroyed() {
            let self = this;
            API.Storage.remove(addonKey, true);
            if (itemIsNpc) {
                API.removeCallbackFromEvent(Engine.apiData.NEW_NPC, this.watchNpc);
                // API.removeCallbackFromEvent("removeNpc", function(e) {
                // 	self.removeItem(e.d.id);
                // });
                API.removeCallbackFromEvent(Engine.apiData.CLEAR_MAP_NPCS, this.removeAllItems);
            } else {
                //Engine.items.removeCallback("m", this.watchItem);
                Engine.items.removeCallback(Engine.itemsFetchData.FETCH_WATCH_ITEM);
            }
        },
        computed: {
            filteredList: function() {
                if (this.searchValue === '') return this.list;
                return this.list.filter((i) => {
                    return i.name.toLowerCase().includes(this.searchValue.toLowerCase());
                })
            }
        },
        methods: {
            searchClear() {
                this.searchValue = '';
            },
            watchItem(i) {
                let self = this;

                if (i.own != Engine.map.d.id) return;

                i.on("delete", function() {
                    self.removeItem(this.id);
                });
                let item = this.createItem(i);
                //Object.freeze(it);
                this.list.push(item);
            },
            watchNpc(n) {
                if (n.d.type != 7) return;
                let item = this.createItem(n, true);
                this.list.push(item);
            },
            createItem(i, isNpc = false) {
                return !isNpc ? {
                    id: i.id,
                    name: i.name,
                    x: i.x,
                    y: i.y,
                    type: "Item",
                    view: this.getView(i)
                } : {
                    id: i.d.id,
                    name: i.d.nick,
                    x: i.d.x,
                    y: i.d.y,
                    type: "Npc",
                    view: CFG.a_npath + i.d.icon
                }
            },
            getView(i) {
                // return Engine.items.createViewIcon(i.id, 'ground-addon-item-vue')[0];
                return Engine.items.createViewIcon(i.id, Engine.itemsViewData.GROUND_ADDON_ITEM_VUE_VIEW)[0];
            },
            removeItem(id) {
                var index = this.list.findIndex(obj => obj.id == id); //this.list.indexOf(e.id);
                if (index >= 0) {
                    this.list.splice(index, 1);
                }
            },
            removeAllItems() {
                this.list = [];
            }
        },
    });

    Vue.component('gi-item', {
        props: {
            item: Object
        },
        template: `
			<div 
				@mouseenter="addArrow(item)"
				@mouseleave="removeArrow(item)"
				@click="goTo(item)"
				:class="{ active: isActive }"
				ref="lala"
    		>
				<div v-if="item.type === 'Item'" class="map_item_cell" v-add-item="item.view"></div>
				<div v-else class="map_item_cell" v-add-npc-tip="item">
					<div class="item">
						<div class="highlight t-norm"></div>
						<div class="icon css-icon" :style="setNpcIcon"></div>
						<div class="icon canvas-icon hide-icon" :style="setNpcIcon"></div>
					</div>
				</div>
				<div class="map_item_cell map_item_center_cell name">{{ item.name }}</div>
				<div class="map_item_cell">{{ item.x }},{{ item.y }}</div>
			</div>
        `,
        data() {
            return {
                isActive: false
            }
        },
        beforeDestroy() { // fix to not fired mouseleave when list is filtering
            this.removeArrow(this.item);
            const originalItem = Engine.items.getItemById(this.item.id);
            if (originalItem) {
                originalItem.$.tipHide();
            }
        },
        destroyed() {

        },
        computed: {
            setNpcIcon: function() {
                return {
                    'background-image': `url('${ this.item.view }')`,
                };
            }
        },
        methods: {
            addArrow(item) {
                let dataItem = item.type === "Item" ? {
                    id: item.id,
                    x: item.x,
                    y: item.y
                } : {
                    d: {
                        id: item.id
                    },
                    rx: item.x,
                    ry: item.y
                };

                Engine.targets.addArrow(item.type + '-' + item.id, item.name, dataItem, item.type, 'navigate');
            },
            removeArrow(item) {
                Engine.targets.deleteArrow(item.type + '-' + item.id);
            },
            goTo(item) {
                Engine.hero.autoGoTo({
                    x: item.x,
                    y: item.y
                });
                this.isActive = true;
                setTimeout(() => {
                    this.isActive = false;
                }, 500)
            }
        },
    });

    function initWindow() {

        hwnd = Engine.windowManager.add({
            content: $(`<div id="${addonKey}"></div>`),
            title: addonName,
            nameWindow: addonKey,
            widget: Engine.widgetsData.name.addon_12,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                x: '251',
                y: '60'
            },
            manageShow: false,
            onclose: () => {
                closeWnd();
                // open = false;
                // API.Storage.set(`${addonKey}/show`, open);
            }
        });

        hwnd.el = hwnd.$[0];
        // closeWnd();
        hwnd.el.classList.add('items-on-ground');
        hwnd.updatePos();
        hwnd.addToAlertLayer();

        const component = document.getElementById(addonKey);
        app.$mount(component);

        addScrollbar();
    }

    function removeWindow() {
        //hwnd.$.remove();
        hwnd.remove();
        //delete hwnd;
        hwnd = null;
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
        //hwnd.el.style.display = 'block';
        hwnd.show()
    }

    function closeWnd() {
        //hwnd.el.style.display = 'none';
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

        // if (open) {
        // 	openWnd();
        // 	hwnd.setWndOnPeak();
        // 	scrollBarUpdate();
        // } else {
        // 	closeWnd();
        // }
        // API.Storage.set(`${addonKey}/show`, open);
    };

    function scrollBarUpdate() {
        $('.scroll-wrapper', hwnd.$).trigger('update');
    }

    function addScrollbar() {
        hwnd.$.find('.scroll-wrapper').addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.search-wrapper', hwnd.$)
        });
    }

    this.start = function() {
        if (running) return;
        running = true;
        addStyles();
        initWindow();

        // if (API.Storage.get(`${addonKey}/show`, false)) {
        // 	openWnd();
        // open = true;
        // }
    };

    this.stop = function() {
        if (!running) return;
        running = false;
        app.$destroy();
        //delAllItem();
        removeStyles();
        removeWindow();
    };

    const style = () => `
        <style id="${addonKey}-style">
			.items-on-ground .content{
				margin: -10px -20px -17px;
			}
			.items-on-ground .search-wrapper{
				margin-bottom: -3px;
			}
			.map-item {
				margin-top: 5px;
			}
			.map_item_table .map_item_cell {
				display: table-cell;
				text-align: center;
				font-size: 11px;
				line-height: normal;
				padding: 2px 0;
				color: white;
				width: 32px;
				min-height: 32px;
				vertical-align: middle;
			}
			.map_item_table .map_item_cell .item {
				position: relative;
			}
			.map_item_table .map_item_cell.map_item_center_cell {
				min-width: 118px;
				text-align: left;
			}
			.items-on-ground .map-item .scrollable .scroll-pane {
				padding-right: 15px
			}
			.items-on-ground .map-item .scrollable .scrollbar-wrapper {
				top: -10px;
				bottom: 24px;
			}
			.map_item_table {
				display: table;
				width: 100%;
				box-sizing: border-box;
			}
			.map_item_table.active {
				outline: 1px solid #a2a2a2;
				outline-offset: -2px;
			}
        </style>
    `;

};