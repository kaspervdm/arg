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
}

document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("[data-hero-home]");
    if (el) new HeroHome({ el });
});
