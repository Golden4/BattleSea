'use strict';

requirejs.config({
    baseUrl: 'js',
    paths: {
        app: 'app',
        Comp: 'components',
        Base: 'components/Base',
        Page: 'components/Page',
        SeaBattle: 'components/SeaBattle',
        css: 'lib/require.css.min'
    }
});

/**
 * Абстрактная фабрика для создания контролов
 */
class AbstractFactory {
    create(component, options) {
        return new component(options || {});
    }
}

const factory = new AbstractFactory();

requirejs(['app/main']);