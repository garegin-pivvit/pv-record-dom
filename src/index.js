import drag from "v-drag"
import EventHub from "./eventHub";
import Widget from "./Widget.vue";

let optionsArr = null;

export default {
 install(Vue, options) {
    Vue.config.errorHandler = (error) => {
        console.error(error);
        EventHub.$emit("onerror-screenshot");
    };

    options.router.beforeEach((to, from, next) => {
        EventHub.$emit("start", {seconds: 5, title: "from " + from.name + " to " + to.name});
        next();
    });
    Vue.use(drag);
    Vue.component("widget", Widget);
    optionsArr = options.clickable;
}
};

window.addEventListener("click", function (event) {
    if(optionsArr && (optionsArr.includes(event.target.id) || optionsArr.some(v => event.target.classList.contains(v)))) {
        setTimeout(() => EventHub.$emit("target-clicked"), 1 * 1000);
    }
});
