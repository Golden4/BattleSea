define([
    'SeaBattle',
    'css!Page/css/Page.css'
], function (SeaBattle) {

    class Page extends React.Component {

        constructor(options) {
            super(options);
            // ${ this.childrens.create(SeaBattle, { page: this })}
        }

        render() {

            // return (
            //     <div class="page">
            //         <div class="content">
            //             <div class="content__main-column">
            //                 <div class="module">
            //                 </div>
            //             </div>
            //             <div class="content__secondary-column">
            //                 <div class="module">
            //                     © Special for Tensor by Alsynbaev F.
            //             </div>
            //             </div>
            //         </div>
            //     </div>);
        }
    }

    return Page;
});
