import GetData from './getData.js';

new GetData(
    document.querySelector('.js-results-wrapper'),
    [
        {
            url: 'https://pokeapi.co/api/v2/ability/9/'
        },
        {
            url: 'https://pokeapi.co/api/v2/ability/1/'
        },
        {
            url: 'https://pokeapi.co/api/v2/ability/2/'
        }
    ]
);
