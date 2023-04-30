# pv-record-dom
```
// main js file
import Widget from "pv-record-dom";


if (process.env.DOM_RECORDER_ENABLED) {
    Vue.use(Widget, { clickable: [
            // strings of classes/ids of elements you want to record //
        ], router: // app_vue_router // });
}

// main VUE component

<widget @events="saveEvents" @screenshot="saveScreenshot"></widget>

...
saveEvents(events) {
    // console.log(events);
    // save events to your database
},
saveScreenshot(screenshot) {
    // console.log(screenshot);
    // save screenshot to your database
},
...
```