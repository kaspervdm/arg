import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

SplitText.register(gsap);
gsap.registerPlugin(ScrollTrigger);

export default class HeroHome {
    constructor(args = {}) {
        this.el = args.el;
        if (!this.el) return;

        this.imageEl = this.el.querySelector(".hero-home__image");
        if (this.imageEl) this._initScrollDarken();

        this._initFeaturedHover();

        this.titleWrap = this.el.querySelector(".hero-home__title-wrap");
        this.titleEl = this.el.querySelector("[data-hero-home-title]");
        if (!this.titleWrap || !this.titleEl) return;

        this.split = null;
        this._splitText();
        if (!this.split || this.split.lines.length === 0) return;

        this._wrapLinesInMasks();
        this._initClipReveal();
    }

    _initScrollDarken() {
        ScrollTrigger.create({
            trigger: this.el,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
                this.imageEl.style.setProperty("--hero-scroll-darken", self.progress * 2);
                this.imageEl.style.setProperty("--hero-image-y", `${self.progress * -160}%`);
                this.el.classList.toggle("is-hidden", self.progress >= 1);
            },
        });
    }

    _splitText() {
        this.split = SplitText.create(this.titleEl, {
            type: "lines",
            linesClass: "hero-home__title-line__inner",
        });
    }

    _wrapLinesInMasks() {
        this.split.lines.forEach((lineEl) => {
            const mask = document.createElement("div");
            mask.className = "hero-home__title-line";
            lineEl.parentNode.insertBefore(mask, lineEl);
            mask.appendChild(lineEl);
        });
    }

    _initClipReveal() {
        gsap.set(this.split.lines, { yPercent: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.el,
                start: "top top",
                end: "top top-=10",
                toggleActions: "none play reverse none",
            },
        });

        tl.to(this.split.lines, {
            yPercent: 100,
            duration: 0.6,
            ease: "power2.in",
            stagger: { each: 0.1, from: "end" },
            overwrite: true,
        });

        ScrollTrigger.refresh();
    }

    _initFeaturedHover() {
        // Use delegation so we always attach to the hero and resolve featured on each event
        this.el.addEventListener("mouseover", (e) => {
            const btn = e.target.closest(".hero-home__featured");
            if (!btn || e.relatedTarget && btn.contains(e.relatedTarget)) return;
            const track = btn.querySelector(".btn__text-track");
            const arrow = btn.querySelector(".btn__arrow-right");
            if (!track) return;
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

        this.el.addEventListener("mouseout", (e) => {
            const btn = e.target.closest(".hero-home__featured");
            if (!btn || e.relatedTarget && btn.contains(e.relatedTarget)) return;
            const arrow = btn.querySelector(".btn__arrow-right");
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
    const el = document.querySelector("[data-hero-home]");
    if (el) new HeroHome({ el });
});
