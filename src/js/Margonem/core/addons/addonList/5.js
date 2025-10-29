module.exports = function() {

    const
        //addonKey = 'addon_5',
        addonKey = Engine.windowsData.name.addon_5,
        addonName = _t('clock');

    let running = false,
        hwnd = null;

    const app = new Vue({
        template: `
			<div class="clock">
				<div class="date">
					<span>{{ day }}.{{ month }}.{{ year }}</span>
				</div>
				<div class="time">
					<span>{{ hour }}:{{ min }}:{{ sec }}</span>
				</div>
			</div>
        `,
        data: {
            interval: null,
            day: null,
            month: null,
            year: null,
            hour: null,
            min: null,
            sec: null,
        },
        created() {
            this.tick();
            this.interval = setInterval(this.tick, 1000);
        },
        destroyed() {
            clearInterval(this.interval);
        },
        methods: {
            tick() {
                const date = new Date();

                this.day = zero(date.getDate());
                this.month = zero(date.getMonth() + 1);
                this.year = date.getFullYear();
                this.hour = zero(date.getHours());
                this.min = zero(date.getMinutes());
                this.sec = zero(date.getSeconds());
            },
        },
    });

    function initWindow() {

        hwnd = Engine.windowManager.add({
            content: $(`<div id="${addonKey}"></div>`),
            title: addonName,
            nameWindow: addonKey,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 60
            },
            closeable: false,
            onclose: () => {

            }
        });

        hwnd.$[0].classList.add("window-clock");
        hwnd.updatePos();
        hwnd.addToAlertLayer();

        const component = document.getElementById(addonKey);
        app.$mount(component);
    }

    this.start = function() {
        if (running)
            return;
        running = true;
        addStyles();
        initWindow();
    };

    this.stop = function() {
        if (!running) return;
        running = false;
        app.$destroy();
        removeWindow();
        removeStyles();
        API.Storage.remove(addonKey, true);
    };

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

    const style = () => `
		<style id="${addonKey}-style">
			.border-window.transparent.window-clock{
				min-width: auto;
				width: 122px;
				font-size: 1em;
			}
			.window-clock .content {
				color: white;
			}
			.window-clock .clock {
				text-align: center;
			}
		</style>
	`;

};