module.exports = function() {
    this.average = {};

    this.setStartAverage = (label) => {
        if (!this.average[label]) {
            this.average[label] = {
                a: [],
                min: 1000000,
                max: 0,
                sum: 0
            };
        }
        this.average[label].start = performance.now();
    };

    this.setEndAverage = (label) => {
        this.average[label].a.push(performance.now() - this.average[label].start);
    };

    this.countAverage = () => {
        for (let k in this.average) {
            let oneAverage = this.average[k];
            for (let i = 0; i < oneAverage.a.length; i++) {
                let val = oneAverage.a[i];
                oneAverage.min = Math.min(oneAverage.min, val);
                oneAverage.max = Math.max(oneAverage.max, val);
                oneAverage.sum += val;
            }
        }

        for (let kk in this.average) {
            console.warn(kk, 'min time call:', this.average[kk].min)
            console.warn(kk, 'max time call:', this.average[kk].max)
            console.warn(kk, 'average time call:', this.average[kk].sum / this.average[kk].a.length)
            console.log('');
        }
    };
}