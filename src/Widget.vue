<template>
 <div class="rr-block" data-html2canvas-ignore="true">
    <div class="widget" v-drag="{ handle: '#header' }">
        <div id="header">DOM Recording</div>
        <button class="button" @click="start()" style="background: aliceblue">Start</button>
        <button class="button" @click="stopFn ? save() : null" style="background: deepskyblue">Stop &amp; Save</button> <br>
        <button class="button" @click="takeScreenshot('screenshot')">Screenshot</button>
        <button class="button" @click="stopFn ? discard : null" style="background: tomato">Discard</button>

        <!-- <RrWebPlayer v-if="showReplay" :events="events" />
        <img v-if="screenshot" width="200px" :src="screenshot" alt="screenshot"> -->
    </div>
</div>
</template>

<script>
import RrWebPlayer from "@preflight-hq/rrweb-player-vue";
import eventHub from "./eventHub";
const rrweb = require("rrweb");

export default {
    components: {
        RrWebPlayer
    },
    data() {
        return {
            events: [],
            stopFn: null,
            screenshot: null,
            showReplay: false
        }
    },
    mounted() {
        eventHub.$on("start", (data) => this.start(data));
        eventHub.$on("target-clicked", () => this.takeScreenshot("target"));
        eventHub.$on("onerror-screenshot", () => this.takeScreenshot("error"));
    },
    methods: {
        start(data = null) {
            let events = [];
            this.stopFn = rrweb.record({
                emit(event) {
                    events.push(event);
                },
                keepIframeSrcFn: true,
                recordCrossOriginIframes: true,
                maskInputOptions: {
                    text: true,
                    email: true,
                    number: true,
                    textarea: true,
                    password: true
                }
            });
            this.events = events;

            if(data) {
                setTimeout(() => {this.save(data.title); this.takeScreenshot("navgation")}, data.seconds * 1000);
            }
        },
        save(title = null) {
            const body = {data: JSON.stringify({ events: this.events }), title: title || "recording"};
            this.stopFn();
            if(this.events.length) {
                this.$emit("events", body);
                this.showReplay = true;
            }
        },
        discard() {
            this.stopFn();
            this.events = [];
        },
        takeScreenshot(type) {
            return this.$html2canvas(document.body, { type: "dataURL" })
                .then((screenshot) => {
                    this.screenshot = screenshot;
                    this.$emit("screenshot", {screenshot, type});
                });
        }
    }
};
</script>

<style>
    .widget {
        position: absolute !important; 
        top: 5%; 
        left: 5%; 
        z-index: 100;
        border: none;
        box-shadow: 0px 0px 8px 5px #aaaaaa;
        border-radius: 5px;
        background: white;
        padding-bottom: 10px;
        width: max-content;
    }
    .widget #header {
        text-align: center; 
        background: darkseagreen;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        margin-bottom: 10px;
        padding: 7px;
    }

    .button {
        padding: 5px 10px;
        margin: 3px 10px;
        font-size: 18px;
        border: none;
        cursor: pointer;
        height: 45px;
        width: 120px;
        border-radius: 10px;
    }

    .button:hover {
        background-color: #dcdcdc;
    }
</style>