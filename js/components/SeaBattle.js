define([
    'SeaBattle/GameGrid',
    'css!SeaBattle/css/SeaBattle.css'
], function (GameGrid) {

    class SeaBattle extends React.Component {

        constructor(options) {
            super(options);
            console.log(React);
            // this.state.width = this.options.width;
            // this.state.height = this.options.height;
        }

        render() {
            // return <div className="gameCanvas">
            //     ${this.childrens.create(GameGrid)}
            // ${this.childrens.create(GameGrid)}
            // </div>;
        }

        afterRender() {
            this.state.canvas = this.getContainer();
            // this.state.canvas.style.height = this.state.height;
            // this.state.canvas.style.width = this.state.width;
        }
    }

    return SeaBattle;
});
