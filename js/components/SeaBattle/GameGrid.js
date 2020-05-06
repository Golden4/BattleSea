define([
    'Base/Component'
], function (Component) {
    'use strict';
    class GameGrid extends Component {

        constructor(options) {
            super(options);
            this.state.fieldSize = 11;
        }

        render(options, { width, height }) {
            return `<div class="gameGrid">

            </div>`;
        }

        afterRender() {
            this.state.gameGrid = this.getContainer();
            const letters = 'АБВГДЕЖЗИК';
            for (let i = 0; i < this.state.fieldSize; i++) {
                for (let j = 0; j < this.state.fieldSize; j++) {
                    const div = document.createElement('div');
                    if (i == 0 || j == 0) {
                        div.className = 'gameGrid__value';
                        if (i == 0 && j != 0) {
                            div.innerHTML = letters[j - 1];
                            div.style.borderBottom = '2px solid #000';
                        }
                        else if (j == 0 && i != 0) {
                            div.innerHTML = i;
                            div.style.borderRight = '2px solid #000';
                        }
                    }
                    else {
                        div.style.borderRight = '2px solid #000';
                        div.style.borderBottom = '2px solid #000';
                        div.className = 'gameGrid__square';
                    }

                    this.state.gameGrid.append(div);
                }

            }
        }
    }

    return GameGrid;
});