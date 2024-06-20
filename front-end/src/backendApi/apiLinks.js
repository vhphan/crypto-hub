import * as constants from "node:constants";

export const links = {

    devNodeUrl: 'http://localhost:3311',

    prodNodeUrl: `${window.location.origin}`,

    baseNodeUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3311' : `${window.location.origin}/node`,

    cryptoBars: function (timeFrame, symbols)  {
        const symbolsStr = symbols.map(symbol=> encodeURIComponent(symbol)).join(',');
        const base = `${this.baseNodeUrl}/v1/api`;
        switch (timeFrame) {
            case '1m':
                return `${base}/cryptoBarsMinutes?symbols=${symbolsStr}`;
            case '1h':
                return `${base}/cryptoBarsHours?symbols=${symbolsStr}`;
            case '1d':
                return `${base}/cryptoBarsDays?symbols=${symbolsStr}`;
            default:
                throw new Error(`Invalid timeFrame: ${timeFrame}`);
        }
    },


}