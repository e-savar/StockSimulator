import React, { useState } from 'react';
import axios from 'axios';

const StockSimulator = () => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [stockQuote, setStockQuote] = useState(null);
  const [buySellMessage, setBuySellMessage] = useState('');
  const [portfolio, setPortfolio] = useState([]);

  const API_KEY = 'cgidcm1r01qnl59fktk0cgidcm1r01qnl59fktkg';

  const getQuote = async () => {
    try {
      const res = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`
      );
      setStockQuote(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTickerChange = (e) => {
    setTicker(e.target.value.toUpperCase());
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleBuyStock = () => {
    const portfolioItem = { ticker, quantity, price: stockQuote.c };
    setPortfolio([...portfolio, portfolioItem]);
    setBuySellMessage(
      `Bought ${quantity} share(s) of ${ticker} at ${stockQuote.c}`
    );
    setQuantity(0);
  };

  const handleSellStock = () => {
    const portfolioItemIndex = portfolio.findIndex(
      (item) => item.ticker === ticker
    );
    if (portfolioItemIndex !== -1) {
      const portfolioItem = portfolio[portfolioItemIndex];
      if (portfolioItem.quantity >= quantity) {
        const newQuantity = portfolioItem.quantity - quantity;
        if (newQuantity === 0) {
          portfolio.splice(portfolioItemIndex, 1);
        } else {
          portfolioItem.quantity = newQuantity;
          portfolioItem.price = stockQuote.c;
          portfolio[portfolioItemIndex] = portfolioItem;
        }
        setBuySellMessage(
          `Sold ${quantity} share(s) of ${ticker} at ${stockQuote.c}`
        );
        setQuantity(0);
        setPortfolio([...portfolio]);
      } else {
        setBuySellMessage('Insufficient shares to sell');
      }
    } else {
      setBuySellMessage(`${ticker} not found in portfolio`);
    }
  };

  return (
    <div className='container'>
      <h1 className='my-4'>Stock Trading Simulator</h1>
      <div className='row'>
        <div className='col-md-4'>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className='form-group'>
              <label htmlFor='tickerInput'>Ticker:</label>
              <input
                type='text'
                className='form-control'
                id='tickerInput'
                value={ticker}
                onChange={handleTickerChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='quantityInput'>Quantity:</label>
              <input
                type='number'
                className='form-control'
                id='quantityInput'
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary mr-2'
              onClick={getQuote}
              disabled={!ticker || quantity <= 0}
            >
              Get Quote
            </button>
            <button
              type='button'
              className='btn btn-success mr-2'
              onClick={handleBuyStock}
              disabled={!stockQuote}
            >
              Buy
            </button>
            <button               type='button'
              className='btn btn-danger'
              onClick={handleSellStock}
              disabled={!stockQuote}
            >
              Sell
            </button>
          </form>
          {buySellMessage && (
            <div className='alert alert-success mt-3'>{buySellMessage}</div>
          )}
        </div>
        <div className='col-md-8'>
          {stockQuote && (
            <div className='card mb-3'>
              <div className='card-header'>{ticker} Quote</div>
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                  Price: ${stockQuote.c.toFixed(2)}
                </li>
                <li className='list-group-item'>
                  Open: ${stockQuote.o.toFixed(2)}
                </li>
                <li className='list-group-item'>
                  High: ${stockQuote.h.toFixed(2)}
                </li>
                <li className='list-group-item'>
                  Low: ${stockQuote.l.toFixed(2)}
                </li>
                <li className='list-group-item'>
                  Previous Close: ${stockQuote.pc.toFixed(2)}
                </li>
              </ul>
            </div>
          )}
          {portfolio.length > 0 && (
            <div className='card'>
              <div className='card-header'>Portfolio</div>
              <ul className='list-group list-group-flush'>
                {portfolio.map((item, index) => (
                  <li className='list-group-item' key={index}>
                    {item.ticker} - {item.quantity} share(s) at ${item.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSimulator;

