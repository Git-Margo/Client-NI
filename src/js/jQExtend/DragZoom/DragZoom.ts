/**
 * DragZoom - the module for dragging and pinch zooming DOM elements
 * Created by Yakuz
 */
interface Pos {
    x: number;
    y: number;
}

interface Point {
    clientX: number;
    clientY: number;
}

interface Options {
    minScale: number;
    maxScale: number;
    factor: number;
}

interface Pointer {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    pointerId: number;
}

interface ZoomData {
    delta: number;
    zoomPoint: Pos;
    type ? : string;
}

declare const RUNNING_UNIT_TEST: any;

module.exports = class DragZoom {
    private pos: Pos = {
        x: 0,
        y: 0
    };
    private scale: number = 1;
    private _zoomTarget: Pos = {
        x: 0,
        y: 0
    };
    private moving: boolean = false;
    private startPos!: Pos;
    private clickPos!: Pos;
    private pointers: Array < Pointer > = [];

    private defaultOptions: Options = {
        minScale: 1,
        maxScale: 6,
        factor: .5
    }

    private options!: Options;

    private prevDiff = -1;

    private el!: HTMLElement;
    private zoomedEl!: HTMLElement;

    constructor(
        private selector: string,
        private passedOptions = {}
    ) {
        if (typeof RUNNING_UNIT_TEST === "undefined") {
            this.init();
        }
    }

    init() {
        this.setOptions();
        this.setElements();
        this.connectEvents();
    }

    setElements() {
        this.el = document.querySelector(this.selector) as HTMLElement;
        if (!this.el) throw Error(`DragZoom: not found element with selector "${this.selector}"`);
        this.zoomedEl = this.el.firstElementChild as HTMLElement;
        if (!this.zoomedEl) throw Error(`DragZoom: not found child element for zooming and dragging`);

        this.zoomedEl.style.transformOrigin = '0 0';
        this.el.style.touchAction = 'none';
    }

    setOptions() {
        this.options = {
            ...this.defaultOptions,
            ...this.passedOptions
        }
        as Options;
        this.options.factor /= 100;
    }

    connectEvents() {
        this.el.addEventListener('wheel', this.onWheel);
        this.el.addEventListener('pointerdown', this.onPointerDown);
    }

    addGlobalListeners() {
        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerup', this.onPointerUp);
    }

    removeGlobalListeners() {
        document.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('pointerup', this.onPointerUp);
    }

    onWheel = (ev: WheelEvent) => {
        ev.preventDefault();
        const {
            deltaY,
            deltaMode,
            pageX,
            pageY
        } = ev;
        let delta = deltaMode === 0 ? deltaY : deltaY * 15; // 1 is "lines", 0 is "pixels" - Firefox uses "lines" for some types of mouse
        delta = delta = -Math.max(-100, Math.min(100, delta));
        //delta = -delta; //revert axis
        const rect = this.el.getBoundingClientRect();

        let zoomPoint = {
            x: pageX - (rect.left + document.body.scrollLeft),
            y: pageY - (rect.top + document.body.scrollTop)
        }
        // or
        // let zoomPoint = {
        //     x: pageX / outerZoom - (rect.left + document.body.scrollLeft),
        //     y: pageY / outerZoom - (rect.top + document.body.scrollTop)
        // }
        // + "transform-origin: 0 0" on outer zoomed element

        this.zoom({
            delta,
            zoomPoint
        });
    };

    zoom({
        delta,
        zoomPoint,
        type = 'scroll'
    }: ZoomData) {
        const outerZoom = this.getOuterZoom();
        zoomPoint = {
            x: zoomPoint.x / outerZoom,
            y: zoomPoint.y / outerZoom
        }
        // zoomPoint = zoomPoint.map(({ x, y }) => ({
        //     x: x / outerZoom,
        //     y: y / outerZoom
        // }));
        const factor = type === 'scroll' ? this.options.factor : this.options.factor * 8; // higher factor for pinch gesture (mobile)

        // const size = { w: target.clientWidth, h: target.clientWidth }

        // determine the point on where the slide is zoomed in
        this._zoomTarget.x = (zoomPoint.x - this.pos.x) / this.scale
        this._zoomTarget.y = (zoomPoint.y - this.pos.y) / this.scale

        // apply zoom
        this.scale += delta * factor * this.scale
        this.scale = Math.max(this.options.minScale, Math.min(this.options.maxScale, this.scale));

        // calculate x and y based on zoom
        this.pos.x = -this._zoomTarget.x * this.scale + zoomPoint.x
        this.pos.y = -this._zoomTarget.y * this.scale + zoomPoint.y

        // Make sure the slide stays in its container area when zooming out
        // if(this.pos.x>0)
        //     this.pos.x = 0
        // if(this.pos.x+size.w*this.scale<size.w)
        //     this.pos.x = -size.w*(this.scale-1)
        // if(this.pos.y>0)
        //     this.pos.y = 0
        // if(this.pos.y+size.h*this.scale<size.h)
        //     this.pos.y = -size.h*(this.scale-1)

        this.setMatrix();
    }

    onPointerDown = (ev: PointerEvent) => {
        ev.preventDefault();

        this.addGlobalListeners();

        this.startPos = {
            x: this.pos.x,
            y: this.pos.y
        };
        this.clickPos = {
            x: ev.clientX,
            y: ev.clientY
        };
        this.movingStart();
        this.addPointer(ev);
    };

    onPointerUp = (ev: PointerEvent) => {
        this.removePointer(ev);
        if (this.getPointersAmount() < 2) {
            this.prevDiff = -1;
        }
        if (this.getPointersAmount() === 0) { // don't remove listeners if multi-touch
            this.removeGlobalListeners();
        }

        //mask.style.display = 'none';
        this.moving = false;
        document.body.classList.remove('no-select');
    }

    onPointerMove = (ev: PointerEvent) => {
        ev.preventDefault();
        // Find this event in the cache and update its record with this event
        for (let i = 0; i < this.getPointersAmount(); i++) {
            if (ev.pointerId === this.pointers[i].pointerId) {
                this.pointers[i] = ev;
                break;
            }
        }

        // If two pointers are down, check for pinch gestures
        if (this.getPointersAmount() === 2) {
            // Calculate the distance between the two pointers
            const curDiff = this.getDistance(this.pointers[0], this.pointers[1]);
            const midpoint = this.getMidpoint(this.pointers[0], this.pointers[1]);
            if (this.prevDiff > 0) {
                let delta = curDiff > this.prevDiff ? 1 : -1;
                this.zoom({
                    delta,
                    zoomPoint: midpoint,
                    type: 'pinch'
                })
            }

            // Cache the distance for the next move event
            this.prevDiff = curDiff;
        } else {
            const outerZoom = this.getOuterZoom();
            if (this.moving === true) {
                const
                    deltaX = ev.clientX - this.clickPos.x,
                    deltaY = ev.clientY - this.clickPos.y;

                this.pos.x = this.startPos.x + deltaX / outerZoom;
                this.pos.y = this.startPos.y + deltaY / outerZoom;
                this.setMatrix();
            }
        }
    }

    getMidpoint(a: Point, b: Point): Pos {
        // if (!b) return a;
        return {
            x: (a.clientX + b.clientX) / 2,
            y: (a.clientY + b.clientY) / 2,
        };
    }

    getDistance(a: Point, b: Point) {
        if (!b) return 0;
        return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
    }

    movingStart() {
        //mask.style.display = 'block';
        this.moving = true;
        document.body.classList.add('no-select');
    }

    addPointer(ev: PointerEvent) {
        this.pointers.push(ev);
    }

    removePointer(ev: PointerEvent) {
        this.pointers = this.pointers.filter(pointer => pointer.pointerId !== ev.pointerId)
        // for (const i in this.pointers) {
        //     if (this.pointers[i].pointerId === ev.pointerId) {
        //         this.pointers.splice(i, 1);
        //         break;
        //     }
        // }
    }

    getPointersAmount() {
        return this.pointers.length;
    }

    centerOn(selectorOrElement: string | HTMLElement) {
        let findEl = (typeof selectorOrElement === 'object' ? selectorOrElement : this.el.querySelector(selectorOrElement)) as HTMLElement; //check if DOM object or selector
        if (findEl) {
            let pos = {
                left: findEl.offsetLeft,
                top: findEl.offsetTop
            };
            let width = findEl.clientWidth;
            let height = findEl.clientHeight;

            this.pos.x = (this.el.clientWidth / 2) - ((pos.left + document.body.scrollLeft + (width / 2)) * this.scale);
            this.pos.y = (this.el.clientHeight / 2) - ((pos.top + document.body.scrollTop + (height / 2)) * this.scale);
            this.setMatrix();
        } else {
            throw Error(`DragZoom: not found element with selector "${findEl}"`);
        }
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    setPosition(position: Pos) {
        if (!(position.hasOwnProperty('x') && position.hasOwnProperty('y'))) {
            throw Error('Wrong position argument - expects { x: XXX, y: YYY }');
        }
        this.pos = position;
    }

    resetPosition(setMatrix = true) {
        this.setPosition({
            x: 0,
            y: 0
        });
        if (setMatrix) {
            this.setMatrix();
        }
    }

    resetScale(setMatrix = true) {
        this.setScale(1);
        if (setMatrix) {
            this.setMatrix();
        }
    }

    resetScaleAndPosition() {
        this.resetScale(false);
        this.resetPosition(false);
        this.setMatrix();
    }

    setMatrix() {
        const matrix = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.pos.x}, ${this.pos.y})`;
        if (typeof RUNNING_UNIT_TEST === "undefined") {
            this.zoomedEl.style.transform = matrix;
        }

        return matrix;
    }

    getOuterZoom() {
        return this.roundToTwo(this.el.getBoundingClientRect().width / this.el.offsetWidth);
    }

    roundToTwo(num: number) {
        // @ts-ignore
        return +(Math.round(num + "e+2") + "e-2");
    }
}