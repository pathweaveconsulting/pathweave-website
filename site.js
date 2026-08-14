/* =========================================================
   PATHWEAVE V1 — SHARED SITE COMPONENTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Header ---------- */

    const header = document.getElementById("site-header");

    if (header) {
        header.innerHTML = `
            <header class="pw-header">
                <div class="pw-container">
                    <nav class="pw-nav">

                        <a href="/" class="pw-logo" aria-label="PathWeave Home">
                            <img src="/logo.png" alt="PathWeave">
                        </a>

                        <div class="pw-nav-links">

                            <a href="/businessos/">BusinessOS</a>

                            <a href="/peopleos/">PeopleOS</a>

                            <a href="/government-advisory/">
                                Government Advisory
                            </a>

                            <a href="/how-we-work/">
                                How We Work
                            </a>

                            <a href="/about/">
                                About
                            </a>

                            <a href="/insights/">
                                Insights
                            </a>

                            <a href="/contact/" class="pw-nav-cta">
                                <span class="pw-btn pw-btn--primary">
                                    Let's Talk
                                </span>
                            </a>

                        </div>

                        <button
                            class="pw-menu-toggle"
                            type="button"
                            aria-label="Open navigation"
                            aria-expanded="false"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                    </nav>
                </div>
            </header>
        `;
    }


    /* ---------- Footer ---------- */

    const footer = document.getElementById("site-footer");

    if (footer) {
        footer.innerHTML = `
            <footer class="pw-footer">

                <div class="pw-container">

                    <div class="pw-footer-grid">

                        <div class="pw-footer-brand">

                            <a href="/">
                                <img
                                    src="/logo.png"
                                    alt="PathWeave"
                                    class="pw-footer-logo"
                                >
                            </a>

                            <p>
                                Business transformation and advisory
                                across business, people, technology
                                and government.
                            </p>

                        </div>


                        <div class="pw-footer-column">

                            <h4>Our Practices</h4>

                            <a href="/businessos/">
                                BusinessOS
                            </a>

                            <a href="/peopleos/">
                                PeopleOS
                            </a>

                            <a href="/government-advisory/">
                                Government Advisory
                            </a>

                        </div>


                        <div class="pw-footer-column">

                            <h4>PathWeave</h4>

                            <a href="/how-we-work/">
                                How We Work
                            </a>

                            <a href="/about/">
                                About
                            </a>

                            <a href="/insights/">
                                Insights
                            </a>

                        </div>


                        <div class="pw-footer-column">

                            <h4>Connect</h4>

                            <a href="/contact/">
                                Start a Conversation
                            </a>

                            <a href="https://www.linkedin.com/company/pathweaveconsulting/">
                                LinkedIn
                            </a>

                        </div>

                    </div>


                    <div class="pw-footer-bottom">

                        <span>
                            © ${new Date().getFullYear()} PathWeave.
                            All rights reserved.
                        </span>

                        <span>
                            People • Process • Technology
                        </span>

                    </div>

                </div>

            </footer>
        `;
    }


    /* ---------- Mobile Navigation ---------- */

    const menuButton = document.querySelector(".pw-menu-toggle");

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            const nav = document.querySelector(".pw-nav-links");

            const isOpen =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            nav.classList.toggle("pw-nav-open");

        });

    }


    /* ---------- Active Navigation ---------- */

    const currentPath =
        window.location.pathname.replace(/\/$/, "") || "/";

    document
        .querySelectorAll(".pw-nav-links a")
        .forEach(link => {

            const linkPath =
                new URL(link.href).pathname.replace(/\/$/, "") || "/";

            if (linkPath === currentPath) {
                link.classList.add("active");
            }

        });

});