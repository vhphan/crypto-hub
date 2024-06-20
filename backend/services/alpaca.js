const Alpaca = require('@alpacahq/alpaca-trade-api');
const {logger} = require("#src/middlewares/logger");

const getClient = () =>
    new Alpaca({
        keyId: process.env.ALPACA_PAPER_API_KEY,
        secretKey: process.env.ALPACA_PAPER_SECRET,
        paper: true,
    })

async function asyncGeneratorToArray(generator) {
    const data = [];
    for await (const d of generator) {
        data.push(d);
    }
    return data;
}

const getStartDateTime = (numOfPeriods, interval) => {
    switch (interval) {
        case '1Min':
            return (new Date(new Date().setMinutes(new Date().getMinutes() - numOfPeriods)));
        case '1Hour':
            return (new Date(new Date().setHours(new Date().getHours() - numOfPeriods)));
        case '1Day':
            return (new Date(new Date().setDate(new Date().getDate() - numOfPeriods)));
        default:
            throw new Error(`Invalid interval: ${interval}`);
    }
};

const getCryptoCandles = async (symbols, interval, numOfPeriods = 100) => {
    const client = getClient();
    const start = getStartDateTime(numOfPeriods, interval);

    const map = await client.getCryptoBars(symbols, {
        start,
        end: (new Date()),
        // timeframe: "1Day", "1Min", "1Hour"
        timeframe: interval,
    });
    return asyncGeneratorToArray(map);
};

const main = async () => {
    try {
        const price = await getCryptoCandles(['BTC/USD'],
            '1Min',
            100);
        console.log(price);
    } catch (e) {
        logger.error(e);
    }
}

if (require.main === module) {
    main().then(() => logger.info('Done')).catch((e) => logger.error(e));
}

module.exports = {
    getCryptoCandles,
    getStartDateTime,
    asyncGeneratorToArray,
    getClient,
    main,
}