declare const askAlert: Function;

type Condition = () => boolean;
type ConfirmOptions = {
    type ? : string;
    isConfirmHotkey ? : boolean;
    isCancelHotkey ? : boolean;
}
type Conditions = {
    condition: Condition;
    message: string;
    confirmOptions ? : ConfirmOptions;
} [];

const defaultConfirmOptions = {
    type: 'yesno4'
}

export default class ConfirmationQueue {
    private conditions: Conditions = [];

    addCondition(condition: Condition, message: string, confirmOptions: ConfirmOptions = {}): this {
        const options = {
            ...defaultConfirmOptions,
            ...confirmOptions
        }
        this.conditions.push({
            condition,
            message,
            confirmOptions: options
        });
        return this;
    }

    processConditions(callback: () => void): void {
        this.processCondition(0, callback);
    }

    private processCondition(index: number, callback: () => void): void {
        if (index < this.conditions.length) {
            const {
                condition,
                message,
                confirmOptions
            } = this.conditions[index];
            if (condition()) {
                askAlert({
                    q: message,
                    clb: () => {
                        this.processCondition(index + 1, callback);
                    },
                    ...confirmOptions
                });
            } else {
                this.processCondition(index + 1, callback);
            }
        } else {
            callback();
        }
    }
}