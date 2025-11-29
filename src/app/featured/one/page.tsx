"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import '../../kiki.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "@/components/landing/navbar";
import LandingFooterSecond from "@/components/landing/landingfooter";


export default function FeatureOne() {
    useEffect(() => {
        function initCarousels() {
            if (typeof window === "undefined") return;
            const $ = (window as any).$;
            if (!$ || !$.fn || !$.fn.owlCarousel) return;

            try {
                ("#uxc-owl-carousel" as any).owlCarousel = null;
            } catch (e) {
            }

            try {
                $("#uxc-owl-carousel").owlCarousel({
                    loop: false,
                    margin: 18,
                    nav: true,
                    dots: false,
                    navText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
                    responsive: {
                        0: { items: 1 },
                        576: { items: 1 },
                        768: { items: 2 },
                        992: { items: 3 },
                    },
                });

                const $owl = $("#tst-owl");

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

                $(".tst-owl .owl-nav button").css("pointer-events", "auto");
                $owl.on("mouseover", function () {
                    $owl.trigger("stop.owl.autoplay");
                });
            } catch (err) {
                setTimeout(initCarousels, 500);
            }
        }

        initCarousels();

        // return () => {

        // };
    }, []);

    const year = new Date().getFullYear();

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
                        <div className="hero rounded-xxl px-4 px-lg-5 py-5">
                            <div className="row align-items-center gy-5">
                                <div className="col-lg-6">
                                    <h1 className="marketing-main light">
                                        Get featured in
                                        <br />50,000+ media outlets across the globe instantly
                                    </h1>
                                    <p className="lead mb-4">
                                        You’ve got the launch, the story, the product, but nobody knows. With Kiki PR, your brand gets
                                        featured on Punch, TechCabal, Forbes, BusinessDay and more in 24 hours without PR agencies,
                                        chasing editors, or heavy retainers.
                                    </p>

                                    <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                                        <a href="#" className="btn btn-white btn-pill">
                                            Get featured now <i className="bi bi-arrow-right ms-1" />
                                        </a>
                                        <a href="#" className="btn btn-outline-ice btn-pill">
                                            See how it works
                                        </a>
                                    </div>
                                </div>

                                {/* Right: image + floating UI */}
                                <div className="col-lg-6">
                                    <div className="hero-art ms-lg-5">
                                        <div className="photo-card shadow-lift">
                                            <img src="/assets/img/feature_landing.png" alt="Model wearing a blue sweater" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /hero */}
                    </div>
                </section>

                {/* TICKER */}
                <section className="ticker light">
                    <div className="container-xxl">
                        <div className="ticker-viewport">
                            <div className="ticker-track" style={{ ["--speed" as any]: "28s" } as React.CSSProperties}>
                                <ul className="ticker-group">
                                    <li>
                                        <img src="/assets/img/logos/businessday.png" alt="business day" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/punch.png" alt="punch" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/techcabal.png" alt="tech cabal" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/forbes.png" alt="forbes" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/yahoo.png" alt="yahoo" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/nbc.png" alt="nbc" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/googlenews.png" alt="google news" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/cbs.png" alt="cbs" />
                                    </li>
                                </ul>
                                <ul className="ticker-group" aria-hidden="true">
                                    <li>
                                        <img src="/assets/img/logos/businessday.png" alt="business day" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/punch.png" alt="punch" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/techcabal.png" alt="tech cabal" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/forbes.png" alt="forbes" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/yahoo.png" alt="yahoo" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/nbc.png" alt="nbc" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/googlenews.png" alt="google news" />
                                    </li>
                                    <li>
                                        <img src="/assets/img/logos/cbs.png" alt="cbs" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 text-center">
                    <div className="container-xxl">
                        <h2 className="display-6 fw-bold mb-2">Why most brands stay invisible</h2>
                        <p className="text-secondary mb-5">
                            Your competition already look like real players.
                            <br />They’re in the news. You look like you are testing. End that today
                        </p>

                        <div className="row">
                            <div className="col-lg-6 p-2">
                                <img src="/assets/img/thewhy.png" className="why-image" alt="why image" />
                            </div>
                            <div className="col-lg-6">
                                <div className="why-feature-box h-100">
                                    <div className="why-box">
                                        <b>💸 Agencies cost a fortune.</b> Retainers start <br /> at $1000/month.
                                    </div>
                                    <div className="why-box">
                                        <b>⏳ News takes too long.</b> By the time your story <br /> is live, it’s old news.
                                    </div>
                                    <div className="why-box">
                                        <b>👁 Nobody sees you.</b> Without media coverage, <br /> you look small and untrustworthy.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* trusted by section */}
                <div className="col-lg-12 p-3">
                    <div className="trusted-hero p-4">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-10">
                                <h1>
                                    <span className="text-primary">Trusted</span> by startups, creators,
                                    <br className="d-none d-md-block" /> and SMEs across Africa.
                                </h1>
                            </div>
                        </div>

                        {/* Main grid */}
                        <div className="row g-3 mt-3 align-items-stretch">
                            {/* LEFT COLUMN */}
                            <div className="col-12 col-md-4 col-lg-3 d-flex flex-column gap-3">
                                {/* 20,000+ card */}
                                <div className="trusted-stat-card small">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="trusted-stat-number">
                                                20,000<span style={{ fontSize: 20, fontWeight: 700 }}>{"+"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="icon-row mt-3">
                                        <div className="icon-circle" title="icon 1">
                                            <img src="/assets/img/icon-music.png" alt="" />
                                        </div>
                                        <div className="icon-circle" title="icon 2">
                                            <img src="/assets/img/icon-record.png" alt="" />
                                        </div>
                                        <div className="icon-circle" title="icon 3">
                                            <img src="/assets/img/icon-loud.png" alt="" />
                                        </div>
                                        <div className="icon-circle" title="icon 4">
                                            <img src="/assets/img/icon-img.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="trusted-stat-sub">Media Outlets</div>
                                </div>

                                {/* 1,000+ Brands card */}
                                <div className="trusted-stat-card pink d-flex flex-column justify-content-center">
                                    <div>
                                        <div style={{ fontSize: 46, fontWeight: 900, color: "#7c1bd8", fontFamily: "Rubik" }}>
                                            1,000<span style={{ fontWeight: 900, fontSize: 28 }}>{"+"}</span>
                                        </div>
                                        <div style={{ fontWeight: 600, marginTop: 6 }}>Brands Featured</div>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE COLUMN */}
                            <div className="col-12 col-md-8 col-lg-5">
                                <div className="image-card">
                                    <img src="/assets/img/trusted-lady.png" alt="Person portrait" />
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="col-12 col-lg-4">
                                <div className="row g-3 h-50">
                                    <div className="col-6 p-2 ">
                                        <div className="stat-card small">
                                            <img src="/assets/img/monthly.png" alt="book icon" />
                                            <div className="monthly-reader">
                                                <h2>80M</h2>
                                                <h6 className="stat-sub">Monthly Readers</h6>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="portrait-card h-100">
                                            <img src="/assets/img/trusted-man.png" alt="portrait" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 h-50">
                                    <div className="delivery-card h-100">
                                        <div className="delivery-content">
                                            <div className="delivery-img">
                                                <img src="/assets/img/mail-blast.png" className="blast" alt="mail blast" />
                                                <img src="/assets/img/blast-line.png" className="blast-line" alt="blast line" />
                                            </div>
                                            <h3>
                                                <span style={{ color: "#4870ea" }}>1day Avg.</span>
                                                <span style={{ fontWeight: 800 }}>Delivery</span>
                                            </h3>
                                            <p>Rolls down from 90 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* your PR Goal */}
                <div className="container py-5">
                    <div className="text-center mb-4">
                        <span className="hero-subpill">Amazing Use Cases</span>
                        <h1 className="hero-title mt-3">What's Your PR Goal?</h1>
                        <p className="hero-lead mx-auto">
                            Kiki PR adapts to your goals. Whether you want local buzz, startup credibility, global authority,
                            or SEO power — <strong>we've got a package for you.</strong>
                        </p>
                    </div>

                    <div className="row g-4 align-items-center">
                        {/* left list */}
                        <div className="col-lg-4">
                            <div className="usecase-card">
                                <div className="list-group list-group-flush">
                                    <div className="usecase-item selected">
                                        <i className="bi bi-globe2 text-primary" aria-hidden />
                                        <div className="label">Global Talent Visas</div>
                                    </div>

                                    <div className="usecase-item">
                                        <i className="bi bi-mic-fill" />
                                        <div className="label">Music &amp; Entertainment</div>
                                    </div>

                                    <div className="usecase-item">
                                        <i className="bi bi-graph-up-arrow" />
                                        <div className="label">SEO &amp; Backlinks</div>
                                    </div>

                                    <div className="usecase-item">
                                        <i className="bi bi-flag-fill" />
                                        <div className="label">USA &amp; UK Markets</div>
                                    </div>

                                    <div className="usecase-item">
                                        <i className="bi bi-megaphone-fill" />
                                        <div className="label">Local Buzz</div>
                                    </div>

                                    <div className="usecase-item">
                                        <i className="bi bi-rocket-fill" />
                                        <div className="label">Tech &amp; Startup Credibility</div>
                                    </div>

                                    <div className="usecase-item">
                                        <i className="bi bi-shield-lock-fill" />
                                        <div className="label">Global Authority</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right visual */}
                        <div className="col-lg-8">
                            <div className="visual-wrap">
                                <div className="photo-frame">
                                    <img src="/assets/img/pr-goal.png" alt="woman holding tablet" />
                                </div>

                                <div className="badge-target" aria-hidden>
                                    <img src="/assets/img/usecase1.png" alt="use case 1" />
                                </div>

                                <div className="badge-medal" aria-hidden>
                                    <img src="/assets/img/usecase2.png" alt="use case 2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PR Goal carousel section */}
                <div className="container uxc-carousel-wrap">
                    <div className="row">
                        <div className="col-12">
                            <div className="owl-carousel uxc-owl" id="uxc-owl-carousel">
                                {/* Card 1 */}
                                <div className="item px-2">
                                    <div className="uxc-card">
                                        <div>
                                            <h5 className="uxc-title">Local Buzz in 24hrs</h5>
                                            <p className="uxc-sub">Perfect for businesses wanting to dominate the Nigerian market.</p>
                                            <ul className="uxc-features">
                                                <li>Featured on Punch, Vanguard, Guardian Nigeria</li>
                                                <li>Reach 80M+ monthly Nigerian readers</li>
                                                <li>Build local trust + recognition</li>
                                            </ul>
                                        </div>

                                        <div className="uxc-image-wrap">
                                            <img src="/assets/img/pr1.png" alt="local-buzz" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="item px-2">
                                    <div className="uxc-card">
                                        <div>
                                            <h5 className="uxc-title">Launch Your Startup Loudly</h5>
                                            <p className="uxc-sub">Ideal for tech companies and startups making waves.</p>
                                            <ul className="uxc-features">
                                                <li>Featured on Techpoint, TechCabal, TechEconomy</li>
                                                <li>Reach investors + tech-savvy audiences</li>
                                                <li>Build startup credibility fast</li>
                                            </ul>
                                        </div>

                                        <div className="uxc-image-wrap">
                                            <img src="/assets/img/pr2.png" alt="startup" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="item px-2">
                                    <div className="uxc-card">
                                        <div>
                                            <h5 className="uxc-title">Go Global, Instantly</h5>
                                            <p className="uxc-sub">For brands seeking international recognition.</p>
                                            <ul className="uxc-features mt-5">
                                                <li>Featured on Forbes, Reuters, Entrepreneur</li>
                                                <li>Establish worldwide credibility</li>
                                                <li>Attract global partners + opportunities</li>
                                            </ul>
                                        </div>

                                        <div className="uxc-image-wrap">
                                            <img src="/assets/img/pr3.png" alt="global" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PR made simple */}
                <div className="prms-wrapper">
                    <div className="prms-kicker">How it works</div>
                    <h1 className="prms-headline">PR Made Simple</h1>
                    <p className="prms-sub">
                        Kiki PR makes press distribution as easy as sending an email campaign. Pick a package, upload your story,
                        and get guaranteed media placements in 24 hours.
                    </p>

                    {/* Steps grid */}
                    <div className="prms-steps">
                        <div className="row gy-3">
                            <div className="col-lg-5 prms-left-col">
                                <div className="prms-card prms-card--large">
                                    <div className="prms-large-illustration" aria-hidden>
                                        <img src="/assets/img/simple1.png" alt="Pick Your Package illustration" />
                                    </div>

                                    <div style={{ marginTop: 12 }}>
                                        <div className="prms-large-title">Pick Your Package</div>
                                        <div className="prms-large-caption">Local, tech, global, or entertainment reach.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-7 prms-right-col">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <div className="prms-card">
                                            <div className="prms-illustration">
                                                <img src="/assets/img/simple2.png" alt="Upload or Create" />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="prms-title">Upload or Create with AI</div>
                                                <div className="prms-body">Upload your press release or let Kiki AI draft it.</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="prms-card">
                                            <div className="prms-illustration">
                                                <img src="/assets/img/simple3.png" alt="Review" />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="prms-title">Review</div>
                                                <div className="prms-body">Our Editorial team reviews and schedules your release.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="prms-card prms-bottom-card">
                                <div className="prms-illustration">
                                    <img src="/assets/img/simple4.png" alt="Publish & Get Links" />
                                </div>
                                <div>
                                    <div className="prms-title">Publish & Get Links</div>
                                    <div className="prms-body">Go live within 6–24 hours, depending on your selected platforms, and get a live report.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="prms-cta-wrap mb-5">
                        <a className="prms-cta" href="#" role="button" aria-label="Launch your PR now">
                            Launch Your PR Now
                        </a>
                    </div>
                </div>

                {/* why kiki PR works */}
                <div className="kiki-panel-wrap">
                    <div className="kiki-panel">
                        <div className="kiki-heading text-center">Why Kiki PR Works.</div>

                        <div className="kiki-grid">
                            <div className="kiki-tile">
                                <div className="centralize">
                                    <div className="kiki-icon" aria-hidden>
                                        <img src="/assets/img/whyicon1.png" alt="" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="kiki-title"><span className="kiki-small-badge">★</span>Instant Authority</div>
                                    <div className="kiki-desc">As Seen On Forbes™ builds credibility overnight.</div>
                                </div>
                            </div>

                            <div className="kiki-tile">
                                <div className="centralize">
                                    <div className="kiki-icon" aria-hidden>
                                        <img src="/assets/img/whyicon2.png" alt="" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="kiki-title"><span className="kiki-small-badge">✅</span>Guaranteed Placements </div>
                                    <div className="kiki-desc">No editor declines. You pay, you publish.</div>
                                </div>
                            </div>

                            <div className="kiki-tile">
                                <div className="centralize">
                                    <div className="kiki-icon" aria-hidden>
                                        <img src="/assets/img/whyicon3.png" alt="" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="kiki-title"><span className="kiki-small-badge">🔗</span>SEO Power</div>
                                    <div className="kiki-desc">High-authority backlinks that rank on Google.</div>
                                </div>
                            </div>

                            <div className="kiki-tile">
                                <div className="centralize">
                                    <div className="kiki-icon" aria-hidden>
                                        <img src="/assets/img/whyicon4.png" alt="" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="kiki-title"><span className="kiki-small-badge">🌍</span>Global Reach</div>
                                    <div className="kiki-desc">Local, African, or worldwide syndication.</div>
                                </div>
                            </div>

                            <div className="kiki-tile">
                                <div className="centralize">
                                    <div className="kiki-icon" aria-hidden>
                                        <img src="/assets/img/whyicon5.png" alt="" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="kiki-title"><span className="kiki-small-badge">💼</span>Investor Trust</div>
                                    <div className="kiki-desc">Media validation that closes funding faster.</div>
                                </div>
                            </div>

                            <div className="kiki-tile">
                                <div className="centralize">
                                    <div className="kiki-icon" aria-hidden>
                                        <img src="/assets/img/whyicon6.png" alt="" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="kiki-title"><span className="kiki-small-badge">🔄</span>Multi-Channel Flow</div>
                                    <div className="kiki-desc">Syncs with your email, SMS & influencer campaigns.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* brands testimony */}
                <div className="tst-wrapper mt-5">
                    <h3 className="tst-heading">Some Brands We've Helped Feature</h3>

                    <div className="tst-logos" aria-hidden>
                        <img className="tst-logo" src="/assets/img/brand1.png" alt="brand1" />
                        <img className="tst-logo" src="/assets/img/brand2.png" alt="brand2" />
                        <img className="tst-logo" src="/assets/img/brand3.png" alt="brand3" />
                        <img className="tst-logo" src="/assets/img/brand4.png" alt="brand4" />
                        <img className="tst-logo" src="/assets/img/brand5.png" alt="brand5" />
                        <img className="tst-logo" src="/assets/img/brand6.png" alt="brand6" />
                    </div>

                    {/* carousel */}
                    <div className="tst-carousel-wrap">
                        <div className="owl-carousel tst-owl" id="tst-owl">
                            <div className="item px-2">
                                <div className="tst-card">
                                    <div className="tst-quote">
                                        “Kiki PR got our funding announcement on TechCabal and BusinessDay within 24 hours. Our
                                        inbound investor emails tripled.”
                                    </div>

                                    <div className="tst-footer">
                                        <div className="tst-avatar">
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60" alt="Temi A" />
                                        </div>
                                        <div>
                                            <div className="tst-author">Temi A.</div>
                                            <div className="tst-role">Fintech Founder</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="item px-2">
                                <div className="tst-card">
                                    <div className="tst-quote">
                                        “We looked like a small shop before. After Kiki PR, we looked like a real brand. Sales grew 35% in 2 weeks.”
                                    </div>

                                    <div className="tst-footer">
                                        <div className="tst-avatar">
                                            <img src="/assets/img/testify.png" alt="Chidi O" />
                                        </div>
                                        <div>
                                            <div className="tst-author">Chidi O.</div>
                                            <div className="tst-role">E-commerce CMO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="item px-2">
                                <div className="tst-card">
                                    <div className="tst-quote">
                                        “I don't have time for PR. Kiki drafted it in one click and sent me links I could share with clients immediately.”
                                    </div>

                                    <div className="tst-footer">
                                        <div className="tst-avatar">
                                            <img src="/assets/img/testify.png" alt="Lara K" />
                                        </div>
                                        <div>
                                            <div className="tst-author">Lara K.</div>
                                            <div className="tst-role">Agency Owner</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="item px-2">
                                <div className="tst-card">
                                    <div className="tst-quote">
                                        “Kiki PR made us look credible overnight — the best investment for our brand awareness.”
                                    </div>
                                    <div className="tst-footer">
                                        <div className="tst-avatar">
                                            <img src="/assets/img/testify.png" alt="Test A" />
                                        </div>
                                        <div>
                                            <div className="tst-author">Alex P.</div>
                                            <div className="tst-role">Founder</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="item px-2">
                                <div className="tst-card">
                                    <div className="tst-quote">
                                        “Fast, simple, and measurable — our campaign ROI improved after Kiki handled our coverage.”
                                    </div>
                                    <div className="tst-footer">
                                        <div className="tst-avatar">
                                            <img src="/assets/img/testify.png" alt="Test B" />
                                        </div>
                                        <div>
                                            <div className="tst-author">Sade R.</div>
                                            <div className="tst-role">Marketing Lead</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guarantee block */}
                    <div className="centralize col-lg-12">
                        <div className="tst-guarantee col-lg-8">
                            <div className="tst-seal" aria-hidden>
                                <img src="/assets/img/satisfy.png" alt="" />
                            </div>
                            <div className="tst-text">
                                <h4>Your Success Is Guaranteed.</h4>
                                <p>If you don’t get published on the outlets you paid for, you get your money back. No excuses. No risks.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vis-panel" style={{ marginTop: 80 }}>
                    <div className="vis-row">
                        <div className="vis-copy">
                            <div className="vis-eyebrow">(customers, investors, partners, fans)</div>

                            <h1 className="vis-title">
                                <b>You</b> are waiting for <br />
                                <b>you. Be visible. be credible.</b>
                            </h1>

                            <p className="vis-lead">
                                In 24 hours, your brand could be in Punch, TechCabal, or Forbes. Or you could still be waiting for a PR
                                agency to call you back. The choice is yours.
                            </p>

                            <div className="vis-cta-group">
                                <button className="vis-btn-primary">Get Featured Now</button>
                                <button className="vis-btn-secondary">See How It Works</button>
                            </div>
                        </div>

                        <div className="vis-visual">
                            <div className="vis-photo">
                                <img src="/assets/img/bevisible.png" alt="Hero image" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <section className="py-5 d-flex ">
                    <div className="container-xxl ">
                        <div className="row  d-flex justify-content-center align-items-center">
                            <div className="col-lg-7 col-xl-6">
                                <h3 className="fw-bold text-primary mb-4">FAQ</h3>

                                <div className="accordion faq-plain" id="faq">
                                    {/* Q1 */}
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q1">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#a1"
                                                aria-expanded="false"
                                                aria-controls="a1"
                                            >
                                                Do I need marketing experience?
                                            </button>
                                        </h2>
                                        <div id="a1" className="accordion-collapse collapse" aria-labelledby="q1" data-bs-parent="#faq">
                                            <div className="accordion-body">Nope. Use our templates and guided flows—just add your brand and products.</div>
                                        </div>
                                    </div>

                                    {/* Q2 */}
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q2">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#a2"
                                                aria-expanded="false"
                                                aria-controls="a2"
                                            >
                                                How fast can I start?
                                            </button>
                                        </h2>
                                        <div id="a2" className="accordion-collapse collapse" aria-labelledby="q2" data-bs-parent="#faq">
                                            <div className="accordion-body">Import contacts, pick a template, hit send—most folks launch in under 15 minutes.</div>
                                        </div>
                                    </div>

                                    {/* Q3 */}
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q3">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#a3"
                                                aria-expanded="false"
                                                aria-controls="a3"
                                            >
                                                What makes Kiki different?
                                            </button>
                                        </h2>
                                        <div id="a3" className="accordion-collapse collapse" aria-labelledby="q3" data-bs-parent="#faq">
                                            <div className="accordion-body">Clear analytics, deliverability focus, and automation that’s simple enough for beginners.</div>
                                        </div>
                                    </div>

                                    {/* Q4 (open by default) */}
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q4">
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#a4"
                                                aria-expanded="true"
                                                aria-controls="a4"
                                            >
                                                Can I cancel anytime?
                                            </button>
                                        </h2>
                                        <div id="a4" className="accordion-collapse collapse show" aria-labelledby="q4" data-bs-parent="#faq">
                                            <div className="accordion-body">Yes. No lock‑ins, no hidden fees.</div>
                                        </div>
                                    </div>
                                </div>
                                {/* /accordion */}
                            </div>
                        </div>
                    </div>
                </section>

                <LandingFooterSecond/>
            </main>
        </>
    );
}
