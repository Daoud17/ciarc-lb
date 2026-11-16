
/* ==========================================
   CIARC LEBANON
   MAIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       1. MOBILE NAVIGATION
    ========================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");

    if (menuToggle && mainNavigation) {

        const mobileQuery = window.matchMedia("(max-width: 991px)");

        function openMenu() {
            mainNavigation.classList.add("open");
            menuToggle.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
        }

        function closeMenu() {
            mainNavigation.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }

        menuToggle.addEventListener("click", function () {
            if (mainNavigation.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mainNavigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            if (
                mobileQuery.matches &&
                mainNavigation.classList.contains("open") &&
                !mainNavigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                mainNavigation.classList.contains("open")
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        function handleBreakpointChange(event) {
            if (!event.matches) {
                closeMenu();
            }
        }

        if (mobileQuery.addEventListener) {
            mobileQuery.addEventListener("change", handleBreakpointChange);
        } else {
            mobileQuery.addListener(handleBreakpointChange);
        }
    }


    /* ==========================================
       2. CONTACT FORM
    ========================================== */

    const contactForm = document.getElementById("ciarcContactForm");
    const contactPhone = document.getElementById("contactPhone");
    const contactFormView = document.getElementById("contactFormView");
    const confirmationView = document.getElementById("contactConfirmationView");
    const submitAnotherButton = document.getElementById("submitAnotherInquiry");
    const contactFormSection = document.getElementById("contactFormSection");
    const confirmationTitle = document.getElementById("contactConfirmationTitle");

    /* LEBANESE PHONE NUMBER: 71 639 222 */

    function formatLebanesePhone(value) {
        let digits = String(value).replace(/\D/g, "");

        // Handle pasted international numbers.
        if (digits.startsWith("00961")) {
            digits = digits.slice(5);
        } else if (digits.startsWith("961")) {
            digits = digits.slice(3);
        }

        digits = digits.slice(0, 8);

        if (digits.length <= 2) {
            return digits;
        }

        if (digits.length <= 5) {
            return digits.slice(0, 2) + " " + digits.slice(2);
        }

        return (
            digits.slice(0, 2) + " " +
            digits.slice(2, 5) + " " +
            digits.slice(5)
        );
    }

    if (contactPhone) {

        contactPhone.addEventListener("input", function () {
            this.value = formatLebanesePhone(this.value);
        });

        contactPhone.addEventListener("paste", function (event) {
            const pastedText = event.clipboardData.getData("text");

            if (pastedText) {
                event.preventDefault();
                this.value = formatLebanesePhone(pastedText);
                this.dispatchEvent(
                    new Event("input", { bubbles: true })
                );
            }
        });
    }

    function showConfirmation() {
        if (!contactFormView || !confirmationView) {
            return;
        }

        contactFormView.hidden = true;
        confirmationView.hidden = false;

        if (contactFormSection) {
            contactFormSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (confirmationTitle) {
            confirmationTitle.focus({
                preventScroll: true
            });
        }
    }

    function restoreContactForm() {
        if (!contactFormView || !confirmationView) {
            return;
        }

        confirmationView.hidden = true;
        contactFormView.hidden = false;

        if (contactForm) {
            contactForm.reset();
        }

        if (contactFormSection) {
            contactFormSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        const fullNameInput = document.getElementById("contactFullName");

        if (fullNameInput) {
            fullNameInput.focus({
                preventScroll: true
            });
        }
    }

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const phoneDigits = contactPhone
                ? contactPhone.value.replace(/\D/g, "")
                : "";

            if (phoneDigits.length !== 8) {
                if (contactPhone) {
                    contactPhone.setCustomValidity(
                        "Please enter an 8-digit Lebanese phone number."
                    );
                    contactPhone.reportValidity();
                    contactPhone.setCustomValidity("");
                }
                return;
            }

            contactForm.reset();
            showConfirmation();
        });
    }

    if (submitAnotherButton) {
        submitAnotherButton.addEventListener("click", restoreContactForm);
    }


    /* ==========================================
       3. HOMEPAGE ANIMATED COUNTERS
    ========================================== */

    const counters = document.querySelectorAll(".home-highlight-number");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function animateCounter(element) {

        if (element.dataset.animated === "true") {
            return;
        }

        element.dataset.animated = "true";

        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || "";
        const formatter = new Intl.NumberFormat("en-US");

        if (!Number.isFinite(target)) {
            return;
        }

        if (prefersReducedMotion) {
            element.textContent = formatter.format(target) + suffix;
            return;
        }

        const duration = 1400;
        let startTime = null;

        function updateCounter(timestamp) {

            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(target * easedProgress);

            element.textContent =
                formatter.format(currentValue) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent =
                    formatter.format(target) + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if (counters.length > 0) {

        if ("IntersectionObserver" in window) {

            const counterObserver = new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });

                },
                { threshold: 0.2 }
            );

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });

        } else {

            counters.forEach(function (counter) {
                animateCounter(counter);
            });
        }
    }


    /* ==========================================
       4. HOMEPAGE APPROACH TABS
    ========================================== */

    const approachTabs = document.querySelectorAll(".home-approach-tab");
    const approachContent = document.getElementById("approachContent");
    const approachNumber = document.querySelector(
        ".home-approach-content-number"
    );
    const approachTitle = document.getElementById(
        "approachContentTitle"
    );
    const approachDescription = document.getElementById(
        "approachContentDescription"
    );

    const approachData = {

        prevent: {
            number: "01",
            title: "Prevention and Early Assessment",
            description:
                "Cardiovascular imaging can contribute to the " +
                "early identification of disease and the assessment " +
                "of cardiovascular risk. Our approach emphasizes " +
                "the value of imaging information in supporting " +
                "preventive strategies and timely clinical evaluation."
        },

        diagnose: {
            number: "02",
            title: "Accurate Cardiovascular Diagnosis",
            description:
                "Advanced cardiovascular imaging provides detailed " +
                "information about cardiac anatomy and function. " +
                "We focus on the role of imaging in identifying " +
                "cardiovascular abnormalities and supporting " +
                "appropriate diagnostic decisions."
        },

        understand: {
            number: "03",
            title: "Understanding Cardiovascular Disease",
            description:
                "Through imaging and research, we aim to improve " +
                "the understanding of cardiovascular structures, " +
                "disease processes, and clinical findings. " +
                "This knowledge supports more informed " +
                "cardiovascular assessment."
        },

        treat: {
            number: "04",
            title: "Supporting Treatment Decisions",
            description:
                "Cardiovascular imaging can provide important " +
                "information for treatment planning and clinical " +
                "decision-making. Our approach connects imaging " +
                "findings with the wider clinical picture to " +
                "support appropriate patient management."
        },

        monitor: {
            number: "05",
            title: "Monitoring Disease and Treatment",
            description:
                "Follow-up imaging can help assess changes in " +
                "cardiovascular conditions and evaluate responses " +
                "to treatment. We recognize the importance of " +
                "consistent imaging assessment in long-term " +
                "cardiovascular care."
        },

        improve: {
            number: "06",
            title: "Improving Cardiovascular Care",
            description:
                "Our ultimate goal is to connect advances in " +
                "cardiovascular imaging and research with " +
                "meaningful clinical applications. By supporting " +
                "informed assessment and decision-making, we aim " +
                "to contribute to better cardiovascular care " +
                "and patient outcomes."
        }
    };

    if (
        approachTabs.length > 0 &&
        approachContent &&
        approachNumber &&
        approachTitle &&
        approachDescription
    ) {

        let approachTimer;

        function selectApproach(tab) {

            const key = tab.dataset.approach;
            const data = approachData[key];

            if (!data) {
                return;
            }

            clearTimeout(approachTimer);

            approachTabs.forEach(function (item) {

                const active = item === tab;

                item.classList.toggle("is-active", active);
                item.setAttribute(
                    "aria-selected",
                    active ? "true" : "false"
                );
                item.tabIndex = active ? 0 : -1;
            });

            function updateContent() {

                approachNumber.textContent = data.number;
                approachTitle.textContent = data.title;
                approachDescription.textContent = data.description;

                approachContent.setAttribute(
                    "aria-labelledby",
                    tab.id
                );

                approachContent.classList.remove("is-changing");
            }

            if (prefersReducedMotion) {
                updateContent();
            } else {
                approachContent.classList.add("is-changing");
                approachTimer = setTimeout(updateContent, 180);
            }
        }

        approachTabs.forEach(function (tab, index) {

            tab.addEventListener("click", function () {
                selectApproach(tab);
            });

            tab.addEventListener("keydown", function (event) {

                let nextIndex = index;

                if (event.key === "ArrowRight") {
                    nextIndex = (index + 1) % approachTabs.length;

                } else if (event.key === "ArrowLeft") {
                    nextIndex =
                        (index - 1 + approachTabs.length) %
                        approachTabs.length;

                } else if (event.key === "Home") {
                    nextIndex = 0;

                } else if (event.key === "End") {
                    nextIndex = approachTabs.length - 1;

                } else {
                    return;
                }

                event.preventDefault();

                const nextTab = approachTabs[nextIndex];

                selectApproach(nextTab);
                nextTab.focus();
            });
        });
    }


    /* ==========================================
       5. EDUCATION PROGRAM ACCORDION
    ========================================== */

    const educationProgramButtons = document.querySelectorAll(
        ".education-program-toggle"
    );

    educationProgramButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.getAttribute("aria-controls");
            const targetContent = document.getElementById(targetId);

            if (!targetContent) {
                return;
            }

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            // Close other expanded programs.
            educationProgramButtons.forEach(function (otherButton) {

                const otherId = otherButton.getAttribute("aria-controls");
                const otherContent = document.getElementById(otherId);

                otherButton.setAttribute("aria-expanded", "false");

                const otherIcon = otherButton.querySelector(
                    ".education-program-icon"
                );

                if (otherIcon) {
                    otherIcon.textContent = "+";
                }

                if (otherContent) {
                    otherContent.hidden = true;
                }
            });

            // Open selected program if it was previously closed.
            if (!isExpanded) {

                button.setAttribute("aria-expanded", "true");
                targetContent.hidden = false;

                const icon = button.querySelector(
                    ".education-program-icon"
                );

                if (icon) {
                    icon.textContent = "−";
                }
            }
        });
    });

});
