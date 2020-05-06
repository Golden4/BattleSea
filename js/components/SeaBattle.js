define([
    'Base/Component',
    'SeaBattle/GameGrid',
    'css!SeaBattle/css/SeaBattle.css'
], function (Component, GameGrid) {
    'use strict';

    class SeaBattle extends Component {

        constructor(options) {
            super(options);
            // this.state.width = this.options.width;
            // this.state.height = this.options.height;
        }

        render(options, { width, height }) {
            return `<div class="gameCanvas">
            ${this.childrens.create(GameGrid)}
            ${this.childrens.create(GameGrid)}
            </div>`;
        }

        afterRender() {
            this.state.canvas = this.getContainer();
            // this.state.canvas.style.height = this.state.height;
            // this.state.canvas.style.width = this.state.width;
        }
    }

    return SeaBattle;
});
