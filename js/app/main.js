
alert();
import Vue from 'vue';

new Vue({
    el: '.page',
    data: {
        players: [
            { name: 'Вася' },
            { name: 'Компуктер' }
        ],

        letters: 'АБВГДЕЖЗИК'
    },
    methods: {
        gridClick: (i, j) => {
            console.log(i + '  ' + j);
        }
    }
})