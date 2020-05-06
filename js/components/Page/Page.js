define([
    'Base/Component',
    'SeaBattle',
    'css!Page/css/Page.css'
], function (Component, SeaBattle) {
    'use strict';

    class Page extends Component {

        constructor(options) {
            super(options);
        }

        render() {
            return `
           <div class="page">
                <div class="content">
                    <div class="content__main-column">
                    <div class="module">
                    ${ this.childrens.create(SeaBattle, { page: this })}
                    </div>
                    </div>
                    <div class="content__secondary-column">
                        <div class="module">
                            © Special for Tensor by Alsynbaev F.
                        </div>
                    </div>
                </div>
            </div>`;
        }
    }

    return Page;
});
