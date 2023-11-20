(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class MousePRLX {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            if (this.config.init) {
                const paralaxMouse = document.querySelectorAll("[data-prlx-mouse]");
                if (paralaxMouse.length) {
                    this.paralaxMouseInit(paralaxMouse);
                    this.setLogging(`Прокинувся, стежу за об'єктами: (${paralaxMouse.length})`);
                } else this.setLogging("Немає жодного обєкта. Сплю...");
            }
        }
        paralaxMouseInit(paralaxMouse) {
            paralaxMouse.forEach((el => {
                const paralaxMouseWrapper = el.closest("[data-prlx-mouse-wrapper]");
                const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
                const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
                const directionX = el.hasAttribute("data-prlx-dxr") ? -1 : 1;
                const directionY = el.hasAttribute("data-prlx-dyr") ? -1 : 1;
                const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;
                let positionX = 0, positionY = 0;
                let coordXprocent = 0, coordYprocent = 0;
                setMouseParallaxStyle();
                if (paralaxMouseWrapper) mouseMoveParalax(paralaxMouseWrapper); else mouseMoveParalax();
                function setMouseParallaxStyle() {
                    const distX = coordXprocent - positionX;
                    const distY = coordYprocent - positionY;
                    positionX += distX * paramAnimation / 1e3;
                    positionY += distY * paramAnimation / 1e3;
                    el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
                    requestAnimationFrame(setMouseParallaxStyle);
                }
                function mouseMoveParalax(wrapper = window) {
                    wrapper.addEventListener("mousemove", (function(e) {
                        const offsetTop = el.getBoundingClientRect().top + window.scrollY;
                        if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
                            const parallaxWidth = window.innerWidth;
                            const parallaxHeight = window.innerHeight;
                            const coordX = e.clientX - parallaxWidth / 2;
                            const coordY = e.clientY - parallaxHeight / 2;
                            coordXprocent = coordX / parallaxWidth * 100;
                            coordYprocent = coordY / parallaxHeight * 100;
                        }
                    }));
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[PRLX Mouse]: ${message}`) : null;
        }
    }
    modules_flsModules.mousePrlx = new MousePRLX({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    {
        const body = document.body;
        const docEl = document.documentElement;
        const MathUtils = {
            lerp: (a, b, n) => (1 - n) * a + n * b,
            distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
        };
        const getMousePos = ev => {
            let posx = 0;
            let posy = 0;
            if (!ev) ev = window.event;
            if (ev.pageX || ev.pageY) {
                posx = ev.pageX;
                posy = ev.pageY;
            } else if (ev.clientX || ev.clientY) {
                posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
                posy = ev.clientY + body.scrollTop + docEl.scrollTop;
            }
            return {
                x: posx,
                y: posy
            };
        };
        let cacheMousePos = {
            x: 0,
            y: 0
        };
        let lastMousePos = {
            ...cacheMousePos
        };
        let mousePos = {
            ...cacheMousePos
        };
        window.addEventListener("mousemove", (ev => mousePos = getMousePos(ev)));
        const getMouseDistance = () => MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
        class Image {
            constructor(el) {
                this.DOM = {
                    el
                };
                this.defaultStyle = {
                    scale: 1,
                    x: 0,
                    y: 0,
                    opacity: 0
                };
                this.getRect();
            }
            getRect() {
                this.rect = this.DOM.el.getBoundingClientRect();
            }
            isActive() {
                return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
            }
        }
        class ImageTrail {
            constructor() {
                this.DOM = {
                    content: document.querySelector(".content")
                };
                this.images = [];
                [ ...this.DOM.content.querySelectorAll("img") ].forEach((img => this.images.push(new Image(img))));
                this.imagesTotal = this.images.length;
                this.imgPosition = 0;
                this.zIndexVal = 1;
                this.threshold = 100;
                requestAnimationFrame((() => this.render()));
            }
            render() {
                let distance = getMouseDistance();
                cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, .1);
                cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, .1);
                if (distance > this.threshold) {
                    this.showNextImage();
                    ++this.zIndexVal;
                    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
                    lastMousePos = {
                        ...mousePos
                    };
                }
                let isIdle = true;
                for (let img of this.images) if (img.isActive()) {
                    isIdle = false;
                    break;
                }
                if (isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
                requestAnimationFrame((() => this.render()));
            }
            showNextImage() {
                const img = this.images[this.imgPosition];
                gsap.killTweensOf(img.DOM.el);
                const startRotation = Math.random() * 230;
                const endRotation = startRotation + 60;
                Math.random(), window.innerWidth, img.rect.width, img.rect.width;
                Math.random(), window.innerHeight, img.rect.height, img.rect.height;
                gsap.timeline().set(img.DOM.el, {
                    startAt: {
                        opacity: 0,
                        scale: 1,
                        rotation: startRotation
                    },
                    opacity: .5,
                    scale: 1,
                    zIndex: this.zIndexVal,
                    x: cacheMousePos.x - img.rect.width / 2,
                    y: cacheMousePos.y - img.rect.height + 200,
                    rotation: startRotation
                }).to(img.DOM.el, {
                    duration: 1.5,
                    ease: "expo.out",
                    x: mousePos.x - img.rect.width + 100,
                    y: mousePos.y - img.rect.height - 200,
                    rotation: endRotation
                }).to(img.DOM.el, {
                    duration: .9,
                    ease: "power1.out",
                    opacity: 0
                }, ">0.2").to(img.DOM.el, {
                    duration: .9,
                    opacity: 0,
                    ease: "quint.out",
                    scale: .9,
                    y: "+=60",
                    rotation: endRotation + 90
                }, ">0.2");
            }
        }
        const preloadImages = () => new Promise(((resolve, reject) => {
            imagesLoaded(document.querySelectorAll(".content__img"), resolve);
        }));
        preloadImages().then((() => {
            new ImageTrail;
        }));
        if (!("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0) && window.innerWidth > 768) preloadImages().then((() => {
            const imageTrail = new ImageTrail;
            requestAnimationFrame((() => imageTrail.render()));
        }));
    }
    function animateCircle(circle, container) {
        const x = Math.random() * container.clientWidth;
        const y = Math.random() * container.clientHeight;
        const duration = 5 + Math.random() * 30;
        gsap.to(circle, {
            x,
            y,
            duration,
            ease: "power1.inOut",
            onComplete: () => animateCircle(circle, container)
        });
    }
    const container = document.querySelector(".hero__container");
    const circles = document.querySelectorAll(".circle");
    circles.forEach((circle => {
        animateCircle(circle, container);
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const counter3 = document.querySelector(".counter-3");
        for (let i = 0; i < 2; i++) for (let j = 0; j < 10; j++) {
            const div = document.createElement("div");
            div.className = "num";
            div.textContent = j;
            counter3.appendChild(div);
        }
        const finalDiv = document.createElement("div");
        finalDiv.className = "num";
        finalDiv.textContent = "0";
        counter3.appendChild(finalDiv);
        function animate(counter, duration, delay = 0) {
            const numHeight = counter.querySelector(".num").clientHeight;
            const totalDistance = (counter.querySelectorAll(".num").length - 1) * numHeight;
            gsap.to(counter, {
                y: -totalDistance,
                duration,
                delay,
                ease: "power2.inOut"
            });
        }
        animate(counter3, 5);
        animate(document.querySelector(".counter-2"), 6);
        animate(document.querySelector(".counter-1"), 2, 4);
    }));
    gsap.to(".digit", {
        top: "-150px",
        stagger: {
            amount: .25
        },
        delay: 6,
        duration: 1,
        ease: "power4.inOut"
    });
    gsap.from(".loader-1", {
        width: 0,
        duration: 6,
        ease: "power2.inOut"
    });
    gsap.from(".loader-2", {
        width: 0,
        delay: 1.9,
        duration: 2,
        ease: "power2.inOut"
    });
    gsap.to(".loader", {
        background: "none",
        delay: 6,
        duration: .1
    });
    gsap.to(".loader-1", {
        rotate: 90,
        y: -50,
        duration: .5,
        delay: 6
    });
    gsap.to(".loader-2", {
        x: -75,
        y: 75,
        duration: .5
    }, "<");
    gsap.to(".loader", {
        scale: 40,
        duration: 1,
        delay: 7,
        ease: "power2.inOut"
    });
    gsap.to(".loader", {
        rotate: 45,
        y: 500,
        x: 2e3,
        duration: 1,
        delay: 7,
        ease: "power2.inOut"
    });
    gsap.to(".loading-screen", {
        opacity: 0,
        duration: .5,
        delay: 7.5,
        ease: "power1.inOut"
    });
    gsap.from("h1", 2, {
        delay: 7.3,
        y: 40,
        opacity: 0,
        ease: "power4.inOut",
        stagger: {
            amount: .1
        }
    });
    gsap.from(".hero__text", 2, {
        delay: 7.1,
        opacity: 0,
        ease: "power4.inOut",
        stagger: {
            amount: .1
        }
    });
    gsap.fromTo(".header__logo", {
        y: -50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: .6
    }, 8.5);
    gsap.fromTo(".menu__item", {
        y: -50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: .6,
        stagger: .2
    }, 8.7);
    gsap.fromTo(".action-header__button", {
        y: -40,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: .6
    }, 8.8);
    function animateDecorCircle(circle, sectionRect) {
        const startRotation = Math.random() * 360;
        const endRotation = startRotation + 360;
        gsap.set(circle, {
            x: Math.random() * sectionRect.width,
            y: Math.random() * sectionRect.height,
            rotation: startRotation
        });
        const tl = gsap.timeline({
            repeat: -1,
            ease: "power1.inOut"
        });
        tl.to(circle, {
            x: () => Math.random() * sectionRect.width,
            y: () => Math.random() * sectionRect.height,
            rotation: endRotation,
            duration: () => 100 + Math.random() * 100
        });
    }
    const section = document.querySelector(".beyond-bounds");
    const sectionRect = section.getBoundingClientRect();
    const decorImages = document.querySelectorAll(".beyond-bounds__decor .decor-beyond-bounds__img");
    decorImages.forEach((img => {
        animateDecorCircle(img, sectionRect);
    }));
    function setRandomPosition(element, container) {
        const containerRect = container.getBoundingClientRect();
        const x = Math.random() * (containerRect.width - element.offsetWidth);
        const y = Math.random() * (containerRect.height - element.offsetHeight);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }
    function gradualFadeIn(element, duration = 2e3) {
        let opacity = 0;
        const delta = 60 / duration;
        function stepFadeIn() {
            opacity += delta;
            element.style.opacity = Math.sin(opacity * Math.PI / 2);
            if (opacity < 1) requestAnimationFrame(stepFadeIn); else setTimeout((() => gradualFadeOut(element)), duration);
        }
        stepFadeIn();
    }
    function gradualFadeOut(element, duration = 1200) {
        let opacity = 1;
        const delta = 60 / duration;
        function stepFadeOut() {
            opacity -= delta;
            element.style.opacity = Math.sin(opacity * Math.PI / 2);
            if (opacity > 0) requestAnimationFrame(stepFadeOut); else {
                setRandomPosition(element, element.parentElement);
                triggerCircleAnimation(element, 500, 3e3);
            }
        }
        stepFadeOut();
    }
    function triggerCircleAnimation(circle, minDelay, maxDelay) {
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        setTimeout((() => gradualFadeIn(circle)), delay);
    }
    function startAnimatingCircles() {
        const section = document.querySelector(".product-highlight");
        const circles = document.querySelectorAll(".product-highlight__item");
        circles.forEach((circle => {
            setRandomPosition(circle, section);
            triggerCircleAnimation(circle, 500, 3e3);
        }));
    }
    window.onload = startAnimatingCircles;
    Splitting();
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".title").forEach((title => {
        const chars = title.querySelectorAll(".char");
        gsap.timeline({
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                end: "70% 80%",
                toggleActions: "play none none none"
            }
        }).from(chars, {
            opacity: 0,
            yPercent: 70,
            stagger: .06,
            ease: "back.out",
            duration: .4
        });
    }));
