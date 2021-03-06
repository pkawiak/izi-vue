import izi from "../../../node_modules/izi-js/dist/izi-js-debug";

export default function (vueDataInjector) {
    return {
        created: function () {
            unwrap$optionsIziInject(this.$options, izi, vueDataInjector);
            moveInjectionsToVueInstance(this);
            const parent = this.__iziFindParent()
            if (parent) {
                parent.__iziWire(this)
            }
        },

        methods: {
            __iziFindParent() {
                let $parent = this;
                let found = false;
                while ($parent && !found) {
                    if ($parent.__iziWire) {
                        found = true;
                        break;
                    }
                    $parent = $parent.$parent
                }
                if (found) {
                    return $parent
                } else {
                    return null
                }
            }
        },

        beforeDestroy: function () {
            const parent = this.__iziFindParent()
            if (parent) {
                parent.__iziDetach(this)
            }
        }
    };
}

function unwrap$optionsIziInject($options, izi, vueDataInjector) {
    if (!$options.iziInject) {
        return;
    }

    for (var prop in $options.iziInject) {
        var beanId = $options.iziInject[prop];
        if (prop !== "data") {
            $options[prop] = izi.inject(beanId);
        } else {
            unwrapDataInjection($options, izi, vueDataInjector);
        }
    }
}

function unwrapDataInjection($options, izi, vueDataInjector) {
    var data = $options.iziInject.data;

    if (!data) {
        return;
    }

    for (var prop in data) {
        var beanId = data[prop];
        $options[prop] = izi.inject(beanId).by(vueDataInjector);
    }
}

function moveInjectionsToVueInstance(vueInstance) {
    for (var prop in vueInstance.$options) {
        var injection = vueInstance.$options[prop];
        if (injection && injection.isIziInjection) {
            vueInstance[prop] = injection;
        }
    }
}
