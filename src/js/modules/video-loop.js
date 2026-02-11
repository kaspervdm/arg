import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class VideoLoop {
    constructor(args = {}) {
        this.el = args.el || null;
        if (!this.el) return;

        this.triggerElementSelector = this.el.dataset.startStopTrigger;
        this.triggerElement = this.el.closest(this.triggerElementSelector);

        if (!this.triggerElement) {
            this.triggerElement = this.el;
        }

        this.initScrollTriggers();
    }

    initScrollTriggers() {
        // Create a ScrollTrigger for video playback based on visibility
        ScrollTrigger.create({
            trigger: this.triggerElement,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => this.playVideo(),
            onEnterBack: () => this.playVideo(),
            onLeave: () => this.pauseVideo(),
            onLeaveBack: () => this.pauseVideo(),
        });
    }

    playVideo() {
        if (this.el && this.el.paused) {
            this.el.play();
        }
    }

    pauseVideo() {
        if (this.el && !this.el.paused) {
            this.el.pause();
        }
    }
}

// Initialize video loop components
document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".js-video-loop");
    videos.forEach((video) => new VideoLoop({ el: video }));
});
