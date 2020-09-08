# FTX-sample

FTX-sample is the Automatic trading program for [FTX](https://ftx.com/#a=4882301)

## How to use
- Register your account on [FTX](https://ftx.com/#a=4882301).
- Create an [FTX](https://ftx.com/#a=4882301) API key and set it in the .env file.
- Install and start this program.

## API Key
- Go to [https://ftx.com/profile](https://ftx.com/profile/#a=4882303) and click the "Create API Key" button in the "API Key" section. Copy the created API key and API secret key.

## Install and start

```
$ git clone git@github.com:edo1z/ftx-sample.git
$ cd ftx-sample
$ npm install
$ vim .env
$ vim config/index.js
$ node main
```

### .env

```
API_KEY=XXXXXXXXXXXXXXXXXXXX
API_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXX
```

### config/index.js
- This file is used for automatic transaction settings.

```
module.exports = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 750000,
  maxSpreadRate: 0.0015,
  minProfitRate: 0.0001,
  maxLossRate: 0.001,
  maxLossRateOfModifyOrder: 0.0005,
  orderTimeLimit: 10,
  counterOrderTimeLimit: 30,
  markets: ['ETH-PERP'],
},
```

- `amountPerTransaction` is the amount per transaction ($)
  - For example, if this parameter is 100 and ETH is $350, you will buy and sell about 0.28 ETH in one trade.
- `minTradeAmountDiff` is the difference between Bid and Ask size over a period of time.
- `maxSpreadRate` is the maximum spread that can be traded automatically.
- `minProfitRate` is the profit rate when making a profitable order by automatic trading
- `maxLossRate` is the loss rate when making a loss cut order for the market
- `maxLossRateOfModifyOrder` is the loss rate when resetting the order price to the current price
- `orderTimeLimit` is the valid order time (seconds)
- `counterOrderTimeLimit` is the valid time for counter orders. When the valid time expires, reset the current price.
- `markets` is a list of markets for automatic trading
