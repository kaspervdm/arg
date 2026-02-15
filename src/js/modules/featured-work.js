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
        this.footer = this.el.querySelector(".home__work__footer");
        if (this.footer) this._initFooterReveal();
        this._initButtonHover();
        this.titleEl = this.el.querySelector("[data-work-bg-title]");
        if (this.items.length) {
            this._initScrollAlignTimeline();
        }
    }

    _setTitle(title) {
        if (this.titleEl) this.titleEl.textContent = title;
    }

    /**
     * Scroll-scrubbed timeline: all items start at 100svh (off-screen) and animate to 0
     * at the same speed. Each item starts at a different time in the timeline (delayOffsets)
     * so easing (ease-out) looks the same for every item. Parallax scrubs with the timeline.
     */
    _initScrollAlignTimeline() {
        // Delay offset per item, normalized 0–1 (order matches .home__work__item--1 … --5)
        const delayOffsets = [0, 0.2, 0.6, 0, 0.4];
        const offsets = Array.from(this.items).map((_, i) => delayOffsets[i] ?? 0);
        // Reserve last 20% of timeline for the travel so all items fit
        const normalizedStarts = offsets.map((o) => o * 0.7);
        const travelDuration = 0.2;

        // First item starts below for slide-in; rest start off-screen (100svh)
        this.items.forEach((item, i) => {
            gsap.set(item, { y: i === 0 ? "50svh" : "100svh" });
        });

        // First item: slide up from bottom when section top hits center (no scrub)
        const firstItem = this.items[0];
        if (firstItem) {
            gsap.to(firstItem, {
                y: 0,
                duration: 0.8,
                ease: "custom(0.33, 0, 0.2, 1)",
                scrollTrigger: {
                    trigger: this.el,
                    start: "top 50%",
                    toggleActions: "play none none none",
                },
            });
        }

        // Initial image parallax state
        this.items.forEach((item) => {
            const imageWrapper = item.querySelector(".home__work__image");
            const image = imageWrapper?.querySelector("img");
            if (image) gsap.set(image, { yPercent: -15 });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.el,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            },
        });

        this.items.forEach((item, i) => {
            const startTime = normalizedStarts[i];

            // Item vertical travel (skip first)
            if (i !== 0) {
                tl.to(
                    item,
                    {
                        y: 0,
                        duration: travelDuration,
                        ease: "custom(0.33, 0, 0.2, 1)",
                    },
                    startTime,
                );

                // Parallax: image yPercent tied to same scroll progress
                const imageWrapper = item.querySelector(".home__work__image");
                const image = imageWrapper?.querySelector("img");
                if (image) {
                    tl.to(
                        image,
                        {
                            yPercent: 0,
                            duration: travelDuration,
                            ease: "none",
                        },
                        startTime,
                    );
                }
            }
        });

        // First item parallax: section entering view (el top: bottom → top of viewport)
        const firstImage = firstItem?.querySelector(".home__work__image img");
        if (firstImage) {
            gsap.fromTo(
                firstImage,
                { yPercent: -15 },
                {
                    yPercent: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: this.el,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    },
                },
            );
        }

        ScrollTrigger.refresh();
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
                "-=0.5",
            )
            .to(
                lineEl,
                {
                    scaleX: 1,
                    duration: 0.8,
                    ease: "power2.inOut",
                },
                "-=0.6",
            );

        ScrollTrigger.refresh();
    }

    /**
     * Reveal the footer button with a clip-path (slides in from below its base) when this.el bottom hits the bottom of the viewport.
     * Button is non-interactive (no click/hover) until fully revealed.
     */
    _initFooterReveal() {
        const button = this.footer.querySelector(".btn");
        if (!button) return;

        gsap.set(button, { clipPath: "inset(0% 0% 100% 0%)", yPercent: 100 });

        const tween = gsap.to(button, {
            clipPath: "inset(0% 0% 0% 0%)",
            yPercent: 0,
            duration: 0.5,
            ease: "custom(0.33, 0, 0.2, 1)",
            paused: true,
            onComplete: () => button.classList.add("is-revealed"),
            onReverseComplete: () => button.classList.remove("is-revealed"),
        });

        ScrollTrigger.create({
            trigger: this.el,
            start: "bottom bottom+=40%",
            onEnter: () => tween.play(),
            onLeaveBack: () => tween.reverse(),
        });

        ScrollTrigger.refresh();
    }

    _initButtonHover() {
        const btn = this.el.querySelector("a.btn--primary");
        const track = btn?.querySelector(".btn__text-track");
        const arrow = btn?.querySelector(".btn__arrow-right");
        if (!track) return;

        btn.addEventListener("mouseenter", () => {
            gsap.set(track, { yPercent: 0 });
            gsap.to(track, {
                yPercent: -50,
                duration: 0.35,
                ease: "power2.out",
            });
            if (arrow) {
                gsap.to(arrow, {
                    x: "170%",
                    duration: 0.4,
                    ease: "power2.out",
                });
            }
        });

        btn.addEventListener("mouseleave", () => {
            if (arrow) {
                gsap.set(arrow, { x: "-50%", opacity: 0 });
                gsap.to(arrow, {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("[data-featured-work]");
    if (el) new FeaturedWork({ el });
});
