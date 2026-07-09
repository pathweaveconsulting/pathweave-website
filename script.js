// PathWeave site interactions & GSAP Animations

document.getElementById('year').textContent = new Date().getFullYear();

// 1. Sticky header background on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 2. Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// 3. Fallback reveal for browsers with prefers-reduced-motion
const revealEls = document.querySelectorAll('.reveal');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
}

/* =========================================================
   GSAP & ScrollTrigger Animations
   ========================================================= */

// Ensure GSAP and ScrollTrigger are loaded before running
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  
  gsap.registerPlugin(ScrollTrigger);

  // A. Hero Section Breath (Slow SVG Rotation & Pulse)
  gsap.to('.diamond-bg', {
    rotation: 360,
    opacity: 0.3, // Slight opacity increase for the pulse
    duration: 80,
    ease: "none",
    repeat: -1,
    yoyo: true,
    transformOrigin: "center center"
  });

  // B. Magnetic Hover Effect for Primary Buttons
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Calculate cursor position relative to button center
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;
      
      // Move button slightly towards cursor
      gsap.to(btn, { 
        x: x * 0.3, 
        y: y * 0.3, 
        duration: 0.3, 
        ease: "power2.out" 
      });
    });

    // Snap back when mouse leaves
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { 
        x: 0, 
        y: 0, 
        duration: 0.7, 
        ease: "elastic.out(1, 0.3)" 
      });
    });
  });

  // C. Scale Readiness Roadmap - Scrollytelling (Desktop Only)
  if (window.innerWidth > 860) {
    const roadmapRows = gsap.utils.toArray('.roadmap-row');
    
    // Create pinned timeline
    const tlRoadmap = gsap.timeline({
      scrollTrigger: {
        trigger: "#readiness",
        start: "center center", 
        end: "+=2500", // Scroll length to pin the section
        pin: true,
        scrub: 1 // Smooth scrubbing tied to scrollbar
      }
    });

    // Animate row transitions (crossfading)
    roadmapRows.forEach((row, index) => {
      if (index > 0) {
        // Fade in next row
        tlRoadmap.to(row, { autoAlpha: 1, duration: 1 }, "+=0.5");
      }
      if (index < roadmapRows.length - 1) {
        // Fade out current row before next comes in
        tlRoadmap.to(row, { autoAlpha: 0, duration: 1 }, "+=1");
      }
    });
  }

  // D. PW-3 Framework - Visual Weaving Reveal
  const pw3Timeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#method",
      start: "top 60%" // Triggers when top of section hits 60% down viewport
    }
  });

  // Sutra slides from left, Tantra from right, Yantra drops in center
  pw3Timeline
    .from("#pw3-sutra", { x: -100, autoAlpha: 0, duration: 0.8, ease: "power2.out" })
    .from("#pw3-yantra", { x: 100, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, "<")
    .from("#pw3-tantra", { y: -60, autoAlpha: 0, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4");

  // E. Track Record Stats - Stagger & Counter
  // Stagger reveal of the three stat blocks
  gsap.from(".gs-stat", {
    scrollTrigger: {
      trigger: "#results",
      start: "top 80%"
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // Time between each block revealing
    ease: "power2.out"
  });

  // Animate the numeric counter for "Years Combined Exp."
  gsap.to("#yearsCounter", {
    scrollTrigger: {
      trigger: "#results",
      start: "top 80%"
    },
    innerText: 25, // Target number
    duration: 2.5,
    snap: { innerText: 1 }, // Snap to whole numbers during animation
    ease: "power1.inOut"
  });

}