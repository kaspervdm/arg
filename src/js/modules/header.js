import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { getViewportHeight } from "../lib/utils";

export default class Header {
    constructor(args = {}) {
        this.header = args.el;
        if (!this.header) return;

        this.lastScrollY = window.scrollY;

        this._initRevealOnScroll();
        this._initNavLinkHover();
    }

    _initNavLinkHover() {
        this.header.querySelectorAll("a.header__nav-link").forEach((link) => {
            const track = link.querySelector(".header__nav-link-track");
            if (!track) return;

            link.addEventListener("mouseenter", () => {
                gsap.set(track, { yPercent: 0 });
                gsap.to(track, {
                    yPercent: -50,
                    duration: 0.35,
                    ease: "power2.out",
                });
            });
        });
    }

    _isFarEnough() {
        return window.scrollY > getViewportHeight() * 0.5;
    }

    _initRevealOnScroll() {
        // Set initial state based on scroll position
        if (this._isFarEnough()) {
            this.header.classList.add("is-floating");
            gsap.set(this.header, { y: 0 });
        } else {
            this.header.classList.remove("is-floating");
            gsap.set(this.header, { clearProps: "y" });
        }

        this.followTl = gsap.timeline({ paused: true });

        this.followTl.to(this.header, {
            y: "-100%",
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
                this.header.classList.toggle("is-floating", false);
            },
            onReverseComplete: () => {
                this.header.classList.toggle("is-floating", true);
            },
        });

        this.headerTrigger = ScrollTrigger.create({
            trigger: "body",
            onUpdate: ({ direction }) => {
                const topOfPage = window.scrollY <= 5;
                if (topOfPage) {
                    this._reset();
                } else {
                    //past 5px
                    if (direction == -1) {
                        this._onScrollUp();
                    } else {
                        this._onScrollDown();
                    }
                }

                this.lastScrollY = window.scrollY;
            },
        });
    }

    _reset() {
        //reset to start state when scrolling to top of page
        if (window.scrollY <= 0) {
            this.header.classList.remove("is-floating");
            gsap.set(this.header, {
                clearProps: "y",
            });
        }
    }

    _onScrollUp() {
        //play the reveal-animation when scrolling up fast enough
        //past 50% of the viewport height
        const isFastEnough = this.lastScrollY - window.scrollY > 10;

        if (this._isFarEnough() && isFastEnough) {
            this.header.classList.toggle("is-floating", true);
            this.followTl.reverse();
        }
    }

    _onScrollDown() {
        //play the hide-animation when scrolling down
        //past 50% of the viewport height
        if (this._isFarEnough()) {
            this.followTl.play();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Header({
        el: document.querySelector(".js-header"),
    });
});
