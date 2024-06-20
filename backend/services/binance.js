const {MainClient} = require('binance');

const getClient = () => {
    return new MainClient({
            api_key: process.env.BINANCE_API_KEY,
            api_secret: process.env.BINANCE_SECRET_KEY,
        }
    )
};


const main = async () => {
    require('dotenv').config();
    const client = getClient();
    client
        .getExchangeInfo()
        .then((result) => {
            console.log('getExchangeInfo inverse result: ', result);
        })
        .catch((err) => {
            console.error('getExchangeInfo inverse error: ', err);
        });
}

if (require.main === module) {
    main().then(() => console.log('Done')).catch((e) => console.error(e));
}