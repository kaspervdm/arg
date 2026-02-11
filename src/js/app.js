// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.log("HMR");
    });
}

import "../sass/index.scss";

import LazySizes from "lazysizes";

import "./modules/lenis";
import "./modules/header";
import "./modules/hero-home";
import "./modules/video-loop";
import "./modules/manifesto";
import "./modules/featured-work";
