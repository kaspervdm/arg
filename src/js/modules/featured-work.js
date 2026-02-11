import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class FeaturedWork {
    constructor(args = {}) {
        this.el = args.el;
        if (!this.el) return;

        this.items = this.el.querySelectorAll("[data-work-item]");
        this.head = this.el.querySelector(".home__work__head");
        if (this.head) this._initHeadReveal();
        this.titleEl = this.el.querySelector("[data-work-bg-title]");
        if (this.items.length) {
            this._initItemsReveal();
            this._initImageParallax();
        }
    }

    _setTitle(title) {
        if (this.titleEl) this.titleEl.textContent = title;
    }

    _initHeadReveal() {
        const lineEl = this.head.querySelector(".home__work__head-line");
        const labelInner = this.head.querySelector(".home__work__label-inner");
        const labelDot = this.head.querySelector(".home__work__label-dot");
        if (!lineEl || !labelInner || !labelDot) return;

        gsap.set(lineEl, { scaleX: 0 });
        gsap.set(labelInner, { yPercent: 100 });
        gsap.set(labelDot, { scale: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.head,
                start: "top 88%",
                toggleActions: "play none none none",
            },
        });

        tl.to(labelInner, {
            yPercent: 0,
            duration: 0.75,
            ease: "power2.out",
        })
            .to(
                labelDot,
                {
                    scale: 1,
                    duration: 0.65,
                    ease: "back.out(1.4)",
                },
                "-=0.5"
            )
            .to(lineEl, {
                scaleX: 1,
                duration: 0.8,
                ease: "power2.inOut",
            }, "-=0.6");

        ScrollTrigger.refresh();
    }

    _initItemsReveal() {
        this.items.forEach((item) => {
            // Set initial state - clipped inset
            gsap.set(item, { clipPath: "inset(50%)" });

            // Animate clip-path to reveal on scroll
            gsap.to(item, {
                clipPath: "inset(0%)",
                duration: 2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
            });
        });
    }

    _initImageParallax() {
        // Skip first item - it will be set up after reveal animation
        this.items.forEach((item, index) => {
            this._setupImageParallax(item);
        });
    }

    _setupImageParallax(item) {
        const imageWrapper = item.querySelector(".home__work__image");
        const image = imageWrapper?.querySelector("img");
        if (!image) return;

        // Subtle parallax: image moves from -5% to +5% vertically
        // as the item scrolls through the viewport
        gsap.fromTo(
            image,
            {
                yPercent: -15,
            },
            {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: imageWrapper,
                    start: "top bottom",
                    end: "top top+=10%",
                    scrub: true,
                },
            }
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("[data-featured-work]");
    if (el) new FeaturedWork({ el });
});
