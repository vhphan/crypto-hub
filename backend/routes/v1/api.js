const express = require('express');
const {createCache} = require("#src/middlewares/cache");
const {getCryptoCandles} = require("#src/services/alpaca");
const asyncHandler = require("#src/middlewares/async");
const {getCandlesMultipleSymbols} = require("#src/services/binanceV2");
const router = express.Router();

router.get('/hello', async function (req, res) {

        // simulate async operation with duration 5 seconds
        // await new Promise(resolve => setTimeout(resolve, 5000));
        res.json({
            success: true,
            message: 'Node server running'
        })
    }
);

const cryptoBars = (interval, cacheDuration) => {
    return [
        createCache(cacheDuration),
        asyncHandler(
            async function (req, res) {
                const symbols = req.query.symbols.split(',');
                const bars = await getCandlesMultipleSymbols(symbols, interval);
                res.json({
                    success: true,
                    data: bars,
                    meta: {
                        symbols
                    }
                });
            }
        )
    ];
};

router.get('/cryptoBarsMinutes', ...cryptoBars('1m', '5 minutes'));
router.get('/cryptoBarsHours', ...cryptoBars('1h', '30 minutes'));
router.get('/cryptoBarsDays', ...cryptoBars('1d', '12 hours'));

module.exports = router;