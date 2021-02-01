'use strict';

const header_text = document.getElementById('header_text');
const currency_value = document.getElementById('currency_value');
const first_currency_input = document.getElementById('first_currency_input');
const second_currency_input = document.getElementById('second_currency_input');
const first_currency_type = document.getElementById('first_currency_type');
const second_currency_type = document.getElementById('second_currency_type');
const currencies = document.getElementById('currencies');

function getLatestRates() {
    return new Promise((resolve, reject) => {
        fetch('https://api.exchangeratesapi.io/latest')
            .then(response => {
                return response.json();
            })
            .then(data => {
                resolve(data)
            });
    });
}

getLatestRates().then(data => {
    for(const [key, value] of Object.entries(data.rates)) {
        currencies.innerHTML += `<option value='${key}'></option>`;
    }
});

function getExchangeRates(currency) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                resolve(data.rates)
            });
    });
}

function updateHeader() {
    header_text.innerHTML = `${first_currency_input.value} ${first_currency_type.value} w przeliczeniu:`;
    currency_value.innerHTML = `${second_currency_input.value} ${second_currency_type.value}`;
}

first_currency_input.addEventListener('keyup', (event) => {
    const currency = first_currency_type.value;

    getExchangeRates(currency).then(data => {
        second_currency_input.value = data[second_currency_type.value] * first_currency_input.value;

        updateHeader();
    });
});

second_currency_input.addEventListener('keyup', (event) => {
    const currency = second_currency_type.value;

    getExchangeRates(currency).then(data => {
        first_currency_input.value = data[first_currency_type.value] * second_currency_input.value;
        
        updateHeader();
    });
});

first_currency_type.addEventListener('change', (event) => {
    const currency = second_currency_type.value;

    getExchangeRates(currency).then(data => {
        first_currency_input.value = data[first_currency_type.value] * second_currency_input.value;

        updateHeader();
    });
});

second_currency_type.addEventListener('change', (event) => {
    const currency = first_currency_type.value;

    getExchangeRates(currency).then(data => {
        second_currency_input.value = data[second_currency_type.value] * first_currency_input.value;

        updateHeader();
    });
})