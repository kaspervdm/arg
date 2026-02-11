import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

SplitText.register(gsap);
gsap.registerPlugin(ScrollTrigger);

export default class Manifesto {
    constructor(args = {}) {
        this.el = args.el;
        if (!this.el) return;

        this.textEl = this.el.querySelector("[data-manifesto-text]");
        if (!this.textEl) return;

        this.split = null;
        this._splitText();
        if (!this.split || this.split.lines.length === 0) return;

        this._wrapLinesInMasks();
        this._initReveal();
    }

    _splitText() {
        this.split = SplitText.create(this.textEl, {
            type: "lines",
            linesClass: "home__manifesto-line__inner",
        });
    }

    _wrapLinesInMasks() {
        this.split.lines.forEach((lineEl) => {
            const mask = document.createElement("div");
            mask.className = "home__manifesto-line";
            lineEl.parentNode.insertBefore(mask, lineEl);
            mask.appendChild(lineEl);
        });
    }

    _initReveal() {
        gsap.set(this.split.lines, { yPercent: 100, skewY: 3, opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.el,
                start: "top bottom-=20%",
                toggleActions: "play none none none",
            },
        });

        tl.to(this.split.lines, {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            stagger: 0.16,
            overwrite: true,
        });

        // Play immediately if section is already in view on load
        ScrollTrigger.refresh();
        const st = tl.scrollTrigger;
        if (st && window.scrollY >= st.start - 10) {
            tl.play(0);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("[data-manifesto]");
    if (el) new Manifesto({ el });
});
