const {Spot} = require('@binance/connector')
const {logger} = require("#src/middlewares/logger");

const getClient = () => {
    return new Spot(process.env.BINANCE_API_KEY, process.env.BINANCE_SECRET_KEY)
}

const getSymbols = async () => {
    require('dotenv').config()
    const client = getClient()
    client
        .exchangeInfo()
        .then((result) => {
            console.log('exchangeInfo inverse result: ', result)
            return result.data.symbols
                .filter(s => s.status === 'TRADING')
                .filter(s => s.quoteAsset === 'USDT')
                .map(s => s.symbol);
        })
        .catch((err) => {
            logger.error(`getExchangeInfo inverse error: ${err}`)
            throw err
        })
}

const formatCandles = (candles) => {
    const convertToDateTime = (timestamp) => {
        return (new Date(timestamp).toISOString())
    }
    return candles.map(c => {
        return {
            openTime: convertToDateTime(c[0]),
            open: parseFloat(c[1]),
            high: parseFloat(c[2]),
            low: parseFloat(c[3]),
            close: parseFloat(c[4]),
            volume: parseFloat(c[5]),
            closeTime: convertToDateTime(c[6]),
            quoteAssetVolume: parseFloat(c[7]),
            numberOfTrades: c[8],
            takerBuyBaseAssetVolume: parseFloat(c[9]),
            takerBuyQuoteAssetVolume: parseFloat(c[10]),
            ignore: c[11]
        }
    })
}
const getCandles = async (symbol, interval, limit = 100) => {
    const client = getClient();
    const klines = await client.klines(symbol, interval, {
        limit
    })
    return formatCandles(klines.data);
}


const getCandlesMultipleSymbols = async (symbols, interval, limit = 100) => {
    const client = getClient();
    const data = {}
    for (const symbol of symbols) {
        const klines = await client.klines(symbol, interval, {
            limit
        })
        data[symbol] = formatCandles(klines.data)
    }
    return data
}


const main = async () => {
    try {
        // const symbols = await getSymbols()
        // console.log(symbols)
        // binance interval 1m, 5m, 1h, 1d
        const candles = await getCandlesMultipleSymbols(['BTCUSDT', 'ETHUSDT'], '1m', 100)
        console.log(candles)
    } catch (e) {
        logger.error(e)
    }

}
if (require.main === module) {
    main().then(() => console.log('Done')).catch((e) => console.error(e))
}

module.exports = {
    getSymbols,
    getCandles,
    getCandlesMultipleSymbols
}