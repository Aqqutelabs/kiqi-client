'use client';

import React, { useEffect } from "react";
import Head from "next/head";
import NavBar from "@/components/landing/navbar";
import LandingFooterSecond from "@/components/landing/landingfooter";
import '../../kiki.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FeatureThree() {
    useEffect(() => {
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

        const waitForjQuery = () => {
            if (typeof window !== "undefined" && window.jQuery && typeof window.jQuery.fn.owlCarousel === "function") {
                const $ = window.jQuery;

                $(".test-carousel").owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    items: 3,
                    autoplay: false,
                    responsive: {
                        0: { items: 1 },
                        576: { items: 1 },
                        768: { items: 2 },
                        992: { items: 3 },
                    },
                });

                // Initialize other carousels if present
                const $owl = $("#tst-owl");
                if ($owl.length) {
                    $owl.owlCarousel({
                        loop: true,
                        margin: 20,
                        nav: true,
                        dots: false,
                        navText: ["‹", "›"],
                        responsive: {
                            0: { items: 1 },
                            576: { items: 1.2, stagePadding: 10 },
                            768: { items: 2 },
                            992: { items: 3 },
                        },
                    });

                    $("#tst-inline-prev").on("click", function () {
                        $owl.trigger("prev.owl.carousel");
                    });
                    $owl.on("mouseover", function () {
                        $owl.trigger("stop.owl.autoplay");
                    });
                }

                // Generic scroll buttons (if blog-scroller were an Owl carousel)
                $(".scroll-btn[data-dir=\"prev\"]").on("click", function () {
                    $(".blog-scroller").trigger("prev.owl.carousel");
                });
                $(".scroll-btn[data-dir=\"next\"]").on("click", function () {
                    $(".blog-scroller").trigger("next.owl.carousel");
                });
            } else {
                setTimeout(waitForjQuery, 100);
            }
        };

        waitForjQuery();
    }, []);

    return (
        <>
            <Head>
                <title>Kiki | Feature Page</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            </Head>

            <main>
                <NavBar/>

                <section className="py-4 py-lg-5">
                    <div className="featured-padded box2">
                        <div className="dark-hero rounded-xxl px-4 px-lg-5 py-5">
                            <div className="row align-items-center gy-5">
                                <div className="col-lg-6">
                                    <h1 className="marketing-main light">🚀 Rank Higher. <br />Convert Faster without Writing a Single Word.</h1>

                                    <small className="text-white mb-3">
                                        Kiki’s Blogging & SEO service gets you Google traffic and credibility while you focus on building your business. We research, write, optimize, and publish content that attracts the right audience.
                                    </small>

                                    <div className="d-flex flex-wrap align-items-center gap-3 mb-4 mt-3">
                                        <a href="#" className="btn btn-white btn-pill">
                                            Start for free <i className="bi bi-arrow-right ms-1" />
                                        </a>
                                        <a href="#" className="btn btn-outline-ice btn-pill">
                                            See Pricing
                                        </a>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="hero-art ms-lg-5">
                                        <div className="photo-card shadow-lift">
                                            <img src="/assets/img/rank.png" alt="Model wearing a blue sweater" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="vis-panel seo" style={{ marginTop: 80, marginBottom: 80 }}>
                    <div className="vis-row">
                        <div className="vis-copy">
                            <h1 className="vis-title">
                                <b>💡 Why Most Businesses Struggle with SEO</b>
                            </h1>

                            <div className="vis-lead">
                                <ul>
                                    <li>❌ Writing is time-consuming and inconsistent.</li>
                                    <li>❌ SEO feels like jargon — keywords, backlinks, optimization.</li>
                                    <li>❌ Agencies overcharge, deliver vague reports, and miss deadlines.</li>
                                    <li>❌ Publishing 1 blog a month won’t move the needle.</li>
                                </ul>
                            </div>


                            <div className="vis-cta-group">
                                <small>
                                    Search engines reward consistency, authority, and optimized content. That’s exactly what Kiki delivers — on autopilot.
                                </small>
                            </div>
                        </div>

                        <div className="vis-visual">
                            <div className="vis-photo">
                                <img src="/assets/img/seo.png" alt="Hero image" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="thesoln-page col-lg-12">
                    <div className="thesoln-card-wrap">
                        <img src="/assets/img/blur_email.png" className="thesoln-envelope" alt="" />
                        <img src="/assets/img/float_soln.png" className="thesoln-booking" alt="" />

                        <div className="thesoln-pill">The Solution</div>
                        <h1 className="thesoln-title">
                            Content That Ranks <br /> &amp; Converts — <span className="thesoln-highlight">Done for You.</span>
                        </h1>

                        <div className="thesoln-grid mt-4">
                            <div className="thesoln-card">
                                <div className="thesoln-icon">
                                    <img src="/assets/img/soln1.png" alt="" />
                                </div>
                                <div>
                                    <h3 className="thesoln-card-title">Research-Driven</h3>
                                    <p className="thesoln-card-text">We find what your audience is searching for.</p>
                                </div>
                            </div>

                            <div className="thesoln-card">
                                <div className="thesoln-icon">
                                    <img src="/assets/img/soln2.png" alt="" />
                                </div>
                                <div>
                                    <h3 className="thesoln-card-title">SEO-Optimized</h3>
                                    <p className="thesoln-card-text">Every blog is keyword-rich, structured, and internally linked.</p>
                                </div>
                            </div>

                            <div className="thesoln-card thesoln-card--large">
                                <div className="thesoln-icon">
                                    <img src="/assets/img/soln3.png" alt="" />
                                </div>
                                <div>
                                    <h3 className="thesoln-card-title">Growth-Focused</h3>
                                    <p className="thesoln-card-text">Not just traffic — content designed to generate leads &amp; sales.</p>
                                </div>
                            </div>
                        </div>

                        <div className="thesoln-cta">
                            <button className="thesoln-btn">See Pricing <span style={{ transform: "translateY(1px)" }}>➜</span></button>
                        </div>
                    </div>
                </div>

                <section className="container py-5">
                    <div className="text-center mb-4">
                        <h1 className="howit-heading mb-0">
                            How It Works in <span className="howit-highlight">3 simple steps</span>
                        </h1>
                    </div>

                    <div className="row g-4 align-items-stretch">
                        <div className="col-12 col-md-4">
                            <div className="step-card">
                                <div className="step-badge">Step 1</div>
                                <div className="step-image w-100">
                                    <div className="inner-ui">
                                        <img src="/assets/img/works1.png" alt="" />
                                    </div>
                                </div>
                                <div className="stepped-title">Tell Us Your Goals</div>
                                <div className="stepped-desc">Share your niche, audience, or focus keywords.</div>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="step-card">
                                <div className="step-badge">Step 2</div>
                                <div className="step-image w-100">
                                    <div className="inner-ui">
                                        <img src="/assets/img/works2.png" alt="" />
                                    </div>
                                </div>
                                <div className="stepped-title">We Write &amp; Optimize</div>
                                <div className="stepped-desc">Our AI + human writers create blogs that pass SEO tests.</div>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="step-card">
                                <div className="step-badge">Step 3</div>
                                <div className="step-image w-100">
                                    <div className="inner-ui">
                                        <img src="/assets/img/works3.png" alt="" />
                                    </div>
                                </div>
                                <div className="stepped-title">Publish &amp; Track</div>
                                <div className="stepped-desc">Blogs go live on your site, reports show results.</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-primary2 py-5 ">
                    <div className="container-xxl" data-scroller>
                        <div className="d-flex align-items-end justify-content-between mb-3">
                            <h2 className="fw-bold mb-0">Recent Blogs</h2>
                            <div className="d-none d-md-flex align-items-center gap-2">
                                <button className="scroll-btn btn btn-light border" type="button" data-dir="prev" aria-label="Scroll left">
                                    <i className="bi bi-chevron-left" />
                                </button>
                                <button className="scroll-btn btn btn-light border" type="button" data-dir="next" aria-label="Scroll right">
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        </div>

                        <div className="blog-scroller">
                            <article className="blog-card blog-blue">
                                <div className="blog-content">
                                    <h3 className="blog-title">5 Mistakes Beginners Make in Email Marketing</h3>
                                    <span className="vline" />
                                    <div className="brand-badge">
                                        <img src="/assets/img/logo.png" alt="KiKi" />
                                    </div>
                                </div>
                                <div className="blog-media">
                                    <img src="/assets/img/blog1.png" alt="Email marketing screen" />
                                </div>
                            </article>

                            <article className="blog-card blog-yellow">
                                <div className="blog-content">
                                    <h3 className="blog-title bubble-chip">Why Engagement &gt; Open Rate in 2025</h3>
                                    <span className="vline dark" />
                                    <div className="brand-badge">
                                        <img src="/assets/img/logo.png" alt="KiKi" />
                                    </div>
                                </div>
                                <div className="blog-media">
                                    <img src="/assets/img/blog2.png" alt="Analytics on laptop" />
                                </div>
                            </article>

                            <article className="blog-card blog-indigo">
                                <div className="blog-content">
                                    <h3 className="blog-title">How AI Writes Emails That Convert</h3>
                                    <span className="vline" />
                                    <div className="brand-badge">
                                        <img src="/assets/img/logo.png" alt="KiKi" />
                                    </div>
                                </div>
                                <div className="blog-media">
                                    <img src="/assets/img/blog3.png" alt="AI illustration" />
                                </div>
                            </article>

                            <article className="blog-card blog-indigo">
                                <div className="blog-content">
                                    <h3 className="blog-title">How AI Writes Emails That Convert</h3>
                                    <span className="vline" />
                                    <div className="brand-badge">
                                        <img src="/assets/img/logo.png" alt="KiKi" />
                                    </div>
                                </div>
                                <div className="blog-media">
                                    <img src="/assets/img/blog4.png" alt="AI illustration" />
                                </div>
                            </article>
                        </div>

                        <div className="d-flex d-md-none justify-content-center gap-2 mt-3">
                            <button className="scroll-btn btn btn-light border" type="button" data-dir="prev" aria-label="Scroll left">
                                <i className="bi bi-chevron-left" />
                            </button>
                            <button className="scroll-btn btn btn-light border" type="button" data-dir="next" aria-label="Scroll right">
                                <i className="bi bi-chevron-right" />
                            </button>
                        </div>
                    </div>
                </section>

                <div className="col-lg-12">
                    <div className="kiki-hero">
                        <h2 className="text-center text-bold" style={{ color: "#ffffff", paddingTop: 50, paddingBottom: 30 }}>
                            <b>Why Choose Kiki SEO?</b>
                        </h2>
                        <div className="container kiki-panel2">
                            <div className="row align-items-center newpanel-bg">
                                <div className="col-lg-6 mb-4 mb-lg-0">
                                    <div className="mt-4">
                                        <div className="kiki-feature">
                                            <img src="/assets/img/choose1.png" alt="" className="kiki-icon" />
                                            <div>Content that ranks fast.</div>
                                        </div>
                                        <div className="kiki-feature">
                                            <img src="/assets/img/choose2.png" alt="" className="kiki-icon" />
                                            <div>Lower cost than hiring in-house.</div>
                                        </div>
                                        <div className="kiki-feature">
                                            <img src="/assets/img/choose3.png" alt="" className="kiki-icon" />
                                            <div>Transparent SEO reports.</div>
                                        </div>
                                        <div className="kiki-feature">
                                            <img src="/assets/img/choose4.png" alt="" className="kiki-icon" />
                                            <div>Scale as you grow.</div>
                                        </div>
                                        <div className="kiki-feature">
                                            <img src="/assets/img/choose5.png" alt="" className="kiki-icon" />
                                            <div>AI + Human blend = speed &amp; quality.</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="kiki-image-card">
                                        <img src="/assets/img/choose-main.png" alt="person" className="kiki-person" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-5">
                                <div className="col-12">
                                    <div className="test-carousel owl-carousel owl-theme">
                                        <div className="item">
                                            <div className="kiki-testimonial">
                                                <p style={{ fontSize: 14 }}>
                                                    "Kiki helped us grow from 200 monthly visitors to 10,000 in 6 months — without hiring an agency."
                                                </p>
                                                <div className="kiki-author">
                                                    <div className="kiki-avatar">T</div>
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>Tunde</div>
                                                        <div style={{ fontSize: 12, color: "#6c757d" }}>Startup Founder</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="item">
                                            <div className="kiki-testimonial">
                                                <p style={{ fontSize: 14 }}>
                                                    "Our ecommerce blog now ranks on page 1 for 12 key terms. Sales doubled."
                                                </p>
                                                <div className="kiki-author">
                                                    <div className="kiki-avatar">L</div>
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>Lara</div>
                                                        <div style={{ fontSize: 12, color: "#6c757d" }}>Online Store Owner</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="item">
                                            <div className="kiki-testimonial">
                                                <p style={{ fontSize: 14 }}>
                                                    "The SEO reports are simple enough for my investors to understand. Huge win."
                                                </p>
                                                <div className="kiki-author">
                                                    <div className="kiki-avatar">C</div>
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>Chuka</div>
                                                        <div style={{ fontSize: 12, color: "#6c757d" }}>SaaS CEO</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="py-5 px-5 mt-5">
                    <div className="container-xxl">
                        <div className="pr-blend rounded-xxl p-4 p-lg-5">
                            <div className="row align-items-center gy-4">
                                <div className="col-lg-6">
                                    <h2 className="fw-bold display-6 mb-3">Blend Your Campaign With PR</h2>
                                    <p className="text-secondary mb-3">
                                        Why stop at inboxes? Amplify your email marketing with guaranteed PR placements on top media outlets. Turn every campaign into a headline, boost credibility, and reach audiences beyond your list.
                                    </p>
                                    <p className="text-secondary mb-4">With Kiki, your story travels further, faster, and with more authority.</p>
                                    <a href="#" className="btn btn-dark btn-pill">
                                        Get Started
                                    </a>
                                </div>

                                <div className="col-lg-6">
                                    <div className="pr-art ms-lg-3">
                                        <span className="pr-blob blob-a" aria-hidden="true" />
                                        <span className="pr-blob blob-b" aria-hidden="true" />
                                        <span className="pr-blob blob-c" aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 d-flex ">
                    <div className="container-xxl ">
                        <div className="row  d-flex justify-content-center align-items-center">
                            <div className="col-lg-7 col-xl-6">
                                <h3 className="fw-bold text-primary mb-4">FAQ</h3>

                                <div className="accordion faq-plain" id="faq">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q1">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a1" aria-expanded="false" aria-controls="a1">
                                                Do I need marketing experience?
                                            </button>
                                        </h2>
                                        <div id="a1" className="accordion-collapse collapse" aria-labelledby="q1" data-bs-parent="#faq">
                                            <div className="accordion-body">Nope. Use our templates and guided flows—just add your brand and products.</div>
                                        </div>
                                    </div>

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q2">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a2" aria-expanded="false" aria-controls="a2">
                                                How fast can I start?
                                            </button>
                                        </h2>
                                        <div id="a2" className="accordion-collapse collapse" aria-labelledby="q2" data-bs-parent="#faq">
                                            <div className="accordion-body">Import contacts, pick a template, hit send—most folks launch in under 15 minutes.</div>
                                        </div>
                                    </div>

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q3">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a3" aria-expanded="false" aria-controls="a3">
                                                What makes Kiki different?
                                            </button>
                                        </h2>
                                        <div id="a3" className="accordion-collapse collapse" aria-labelledby="q3" data-bs-parent="#faq">
                                            <div className="accordion-body">Clear analytics, deliverability focus, and automation that’s simple enough for beginners.</div>
                                        </div>
                                    </div>

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q4">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#a4" aria-expanded="true" aria-controls="a4">
                                                Can I cancel anytime?
                                            </button>
                                        </h2>
                                        <div id="a4" className="accordion-collapse collapse show" aria-labelledby="q4" data-bs-parent="#faq">
                                            <div className="accordion-body">Yes. No lock‑ins, no hidden fees.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <LandingFooterSecond/>
            </main>
        </>
    );
}
