import {
    setAttributes
} from "@core/HelpersTS";

const Templates = require('@core/Templates');

interface TableOptions {
    cssClass ? : string;
    scrollMove ? : () => void;
    useScrollbar ? : boolean;
    useStickyHeader ? : boolean;
}

interface TableParams {
    wrapper: HTMLElement;
    headerRecord: RecordsData;
    bodyRecordsArray: RecordsData[];
    options ? : Partial < TableOptions > ;
}

interface SingleRecordData {
    content: string | HTMLElement;
    colspan ? : number;
    cssClass ? : string;
    tag ? : CellType;
    tip ? : string;
    callback ? : () => void;
}

export type RecordsData = {
    attrs ? : {
        [key: string]: string | number;
    };
    cssClass ? : string;
    rowData: SingleRecordData[]
};

export enum CellType {
    TH = 'th',
        TD = 'td'
}

interface ScrollBarConfig {
    track: boolean;
    addScrollableClassToAnotherEl: JQuery < HTMLElement > ;
    callback ? : () => void;
}

export default class Table {
    private options!: TableOptions;
    private table: HTMLElement | null = null;
    private $table: JQuery < HTMLElement > | null = null;
    // private scrollTablePlug: HTMLElement | null = null;

    private defaultOptions: TableOptions = {
        cssClass: undefined,
        scrollMove: undefined,
        useScrollbar: false,
        useStickyHeader: false
    };

    constructor({
        wrapper,
        headerRecord,
        bodyRecordsArray,
        options = {}
    }: TableParams) {
        this.options = {
            ...this.defaultOptions,
            ...options
        };
        this.initTable();
        this.initTableHeader(headerRecord);
        this.initBodyRecords(bodyRecordsArray);

        if (this.options.useScrollbar) {
            this.initScrollBar();
            // this.addPlugToScrollbar();
        }

        wrapper.appendChild(this.table!);

        if (this.options.useScrollbar) {
            this.updateScroll();
        }
    }

    // private addPlugToScrollbar(): void {
    //     this.scrollTablePlug = document.createElement('div');
    //     this.scrollTablePlug.classList.add('scroll-table-plug');
    //
    //     this.table!.appendChild(this.scrollTablePlug);
    // }

    private initTable(): void {
        this.table = Templates.get('table-component')[0] as HTMLElement;

        if (this.options.cssClass) this.table.classList.add(this.options.cssClass);

        let tableContent: HTMLElement;
        if (this.options.useScrollbar) {
            if (this.options.useStickyHeader) this.table.classList.add('c-table--sticky-header');
            tableContent = Templates.get('table-scrollbar')[0];
        } else {
            tableContent = Templates.get('table')[0];
        }
        this.table.appendChild(tableContent);
    }

    private initTableHeader(headerData: RecordsData): void {
        const headersEl = this.createRecords(headerData, CellType.TH);
        const thead = this.table!.querySelector('thead');
        if (thead) {
            thead.appendChild(headersEl);
        }
    }

    private initBodyRecords(bodyRecordsArray: RecordsData[]): void {
        const tableToAttachRecords = this.table!.querySelector('tbody');
        for (let i = 0; i < bodyRecordsArray.length; i++) {
            const recordsEl = this.createRecords(bodyRecordsArray[i]);
            tableToAttachRecords?.append(recordsEl);
        }
    }

    public scrollTop(): void {
        $('.scroll-wrapper', $(this.table!)).trigger('scrollTop');
    }

    public updateScroll(): void {
        $('.scroll-wrapper', $(this.table!)).trigger('update');

        // if (this.scrollTablePlug && this.table) {
        //     this.scrollTablePlug.style.height = `${this.table.offsetHeight - 2}px`;
        // }
    }

    private initScrollBar(): void {
        const config: ScrollBarConfig = {
            track: true,
            addScrollableClassToAnotherEl: $(this.table!)
        };

        if (this.options.scrollMove) {
            config.callback = this.options.scrollMove;
        }

        $(this.table!).find('.scroll-wrapper').addScrollBar(config);
    }

    public getTable(): HTMLElement | null {
        return this.table;
    }

    public createRecords(data: RecordsData, cellTag: CellType = CellType.TD): HTMLElement {
        const tr = document.createElement('tr');
        if (data.cssClass) tr.classList.add(data.cssClass);
        if (data.attrs) setAttributes(tr, data.attrs);

        for (const [index, record] of data.rowData.entries()) {
            if (record.tag) cellTag = record.tag;
            const cell = document.createElement(cellTag) as HTMLTableCellElement;
            cell.setContent(record.content);
            if (record.colspan) cell.colSpan = record.colspan;
            if (record.cssClass) cell.classList.add(...record.cssClass.split(' '));
            if (record.tip) $(cell).tip(record.tip);
            if (record.callback) this.setRecordCallback(cell, record.callback);
            tr.appendChild(cell);
        }

        return tr;
    }

    private setRecordCallback(cell: HTMLElement, callback: () => void): void {
        cell.addEventListener('click', () => callback());
    }
}