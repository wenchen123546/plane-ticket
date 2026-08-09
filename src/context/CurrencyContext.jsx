import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const currencySymbols = {
  TWD: 'TWD',
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('TWD');
  const [exchangeRates, setExchangeRates] = useState({
    TWD: 1, USD: 0.031, EUR: 0.029, JPY: 4.6 // Fallback values
  });
  const [rateError, setRateError] = useState(null);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/TWD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates({
            TWD: 1,
            USD: data.rates.USD,
            EUR: data.rates.EUR,
            JPY: data.rates.JPY
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch exchange rates:', err);
        setRateError(err);
      });
  }, []);

  const formatPrice = (amountInTWD) => {
    const rate = exchangeRates[currency] || 1;
    const converted = amountInTWD * rate;
    
    let formatted;
    if (currency === 'JPY' || currency === 'TWD') {
      formatted = Math.round(converted).toLocaleString();
    } else {
      formatted = converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    return `${currencySymbols[currency]} ${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rate: exchangeRates[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
};
