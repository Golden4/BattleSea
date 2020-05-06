define([
    'Base/Model'
], function (Model) {
    'use strict';

    class Entity extends Model {

        constructor(options) {
            super(options);
            this.state.name = this.options.name;
        }
    }

    return Entity;
});