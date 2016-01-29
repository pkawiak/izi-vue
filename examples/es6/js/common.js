import Vue from "vue";
import izi from "../../../dist/izi-vue";

Vue.use(izi.VuePlugin);

const MainView = Vue.izi.MainView;
const vueDataInjector = Vue.izi.vueDataInjector;

export {Vue, izi, MainView, vueDataInjector};