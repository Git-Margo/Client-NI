const tpl = require('@core/Templates');

export class PreviewWindow {
    private wnd: any;
    public wndEl!: HTMLElement;

    constructor(private onClose: () => void) {
        this.initWindow();
        this.initScrollBar();
    }

    private initScrollBar(): void {
        const scrollBarEl = this.wndEl.querySelector('.scroll-wrapper') as HTMLElement;
        $(scrollBarEl).addScrollBar({
            track: true
        });
    }

    private updateScroll(): void {
        $('.scroll-wrapper', this.wnd.$).trigger('update');
    }

    public setDescription(text: string): void {
        this.wndEl.querySelector('.items-txt') !.innerHTML = text;
    }

    public setWindowTitle(title: string): void {
        this.wnd.title(title);
    }

    private initWindow(): void {
        const content = tpl.get('loot-preview');
        Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.LOOT_PREVIEW,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('items_list'),
            addClass: 'fixed-wnd v-hidden',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();
        this.wndEl = this.wnd.$[0];
    }

    public show(): void {
        this.wndEl.classList.remove('v-hidden');
        this.updateScroll();
        this.wnd.center();
    }

    public addContent(content: HTMLElement) {
        this.wndEl.querySelector(`.scroll-pane`) !.appendChild(content);
    }

    public clear(): void {
        this.wndEl.querySelector('.scroll-pane') !.innerHTML = '';
        this.wndEl.querySelector('.item-container') !.innerHTML = '';
        this.setDescription('');
    }

    close(): void {
        this.wnd.remove();
        this.onClose();
    }
}