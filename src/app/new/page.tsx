"use client";
import { useEffect, useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import '../kiki.css';
import { usePathname } from "next/navigation";
import NavBar from '@/components/landing/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingFooterSecond from '@/components/landing/landingfooter';


export default function Home() {

    const pathname = usePathname();

    const [year, setYear] = useState(new Date().getFullYear())
    pathname.startsWith("/feature");

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <>
            <Head>
                <title>Kiki — Email Marketing Without the Headache</title>
            </Head>

            <NavBar/>

            <section className="py-4 py-lg-5">
                <div className="container-xxl">
                    <div className="hero rounded-xxl px-4 px-lg-5 py-5">
                        <div className="row align-items-center gy-5">
                            <div className="col-lg-6">
                                <h1 className="marketing-main">
                                    Email Marketing<br />Without the Headache
                                </h1>
                                <p className="lead mb-4">
                                    Launch campaigns, grow subscribers, and drive sales — without learning “Email Marketing”.
                                </p>

                                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                                    <a href="#" className="btn btn-white btn-pill">
                                        Start For Free <i className="bi bi-arrow-right ms-1"></i>
                                    </a>
                                    <a href="#" className="btn btn-outline-ice btn-pill">
                                        <i className="bi bi-play-fill me-1"></i> Watch Demo
                                    </a>
                                    <img className="avatar" src="https://i.pravatar.cc/80?img=32" alt="Customer avatar" loading="lazy" />
                                </div>

                                <div className="d-flex flex-wrap gap-4">
                                    <div className="d-flex align-items-center gap-2 text-white">
                                        <i className="bi bi-check-circle-fill mini-check"></i>
                                        <span>No technical experience required</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-white">
                                        <i className="bi bi-check-circle-fill mini-check"></i>
                                        <span>No credit card required</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: image + floating UI */}
                            <div className="col-lg-6">
                                <div className="hero-art ms-lg-5">
                                    <div className="photo-card shadow-lift">
                                        <img src="/assets/img/main.png" alt="Model wearing a blue sweater" loading="lazy" />
                                    </div>
                                    <div className="photo-outline" aria-hidden="true"></div>

                                    {/* Floating bits */}
                                    <div className="float pos-tl">
                                        <img className="avatar" src="https://i.pravatar.cc/100?img=4" alt="Avatar" loading="lazy" />
                                    </div>

                                    <a href="#" className="float btn-campaign bg-info text-white">
                                        <span>
                                            <i className="bi bi-plus-lg me-1"></i>
                                            Create Campaign
                                        </span>
                                    </a>

                                    <div className="float pos-mid-r stat-card">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="percent-text">88.60%</span>
                                            <span className="text-success small"><i className="bi bi-arrow-up-right"></i> 1.3%</span>
                                        </div>
                                        <div className="text-secondary small">Avg. open rate</div>
                                    </div>

                                    <div className="float pos-mid-l chat-bubble">
                                        Hi, do you have a blue dress in UK size 12?
                                    </div>
                                    <div className="float" style={{ top: '48%', left: '-.9rem' }}>
                                        <img className="avatar" src="https://i.pravatar.cc/100?img=11" alt="Avatar" loading="lazy" />
                                    </div>

                                    <div className="product-card shadow">
                                        <img src="/assets/img/ladyslide.jpg" alt="Blue dress" loading="lazy" />
                                        <div style={{ paddingLeft: 10 }}>
                                            <div className="product-title">Amiri Dress</div>
                                            <div className="product-subtitle">Soft weight light chiffon dress</div>
                                            <div className="product-subtitle mt-2">Fabric: 100%</div>
                                            <div className="product-subtitle">Polyester: 100%</div>
                                            <div className="d-flex flex-wrap gap-2 small text-secondary">
                                                <span>Color: <b>Blue</b></span>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 small text-secondary">
                                                <span>Size: 12</span>
                                            </div>
                                            <button className="add-to-cart"><i className="bi bi-bag-plus me-1"></i>Add
                                                to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>{/* /hero */}
                </div>
            </section>

            <section className="ticker">
                <div className="container-xxl">
                    <div className="ticker-viewport">
                        <div className="ticker-track">
                            <ul className="ticker-group">
                                <li><i className="bi bi-check2-circle me-2"></i>Quick campaigns</li>
                                <li><i className="bi bi-people me-2"></i>Subscribers on autopilot</li>
                                <li><i className="bi bi-graph-up-arrow me-2"></i>Magic metrics dashboard</li>
                                <li><i className="bi bi-emoji-smile me-2"></i>Sales, not stress</li>
                                <li><i className="bi bi-shield-check me-2"></i>100% deliverability focus</li>
                                <li><i className="bi bi-phone me-2"></i>Mobile friendly templates</li>
                            </ul>
                            <ul className="ticker-group" aria-hidden="true">
                                <li><i className="bi bi-check2-circle me-2"></i>Quick campaigns</li>
                                <li><i className="bi bi-people me-2"></i>Subscribers on autopilot</li>
                                <li><i className="bi bi-graph-up-arrow me-2"></i>Magic metrics dashboard</li>
                                <li><i className="bi bi-emoji-smile me-2"></i>Sales, not stress</li>
                                <li><i className="bi bi-shield-check me-2"></i>100% deliverability focus</li>
                                <li><i className="bi bi-phone me-2"></i>Mobile friendly templates</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 text-center">
                <div className="container-xxl">
                    <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis fw-semibold px-3 py-2 mb-3">Inbox
                        Magic</span>

                    <h2 className="display-6 fw-bold mb-2">
                        We send the <span className="text-primary">Emails.</span> You get the <span
                            className="text-success">Sales.</span>
                    </h2>
                    <p className="text-secondary mb-5">
                        Upload a sheet, paste contacts, or connect your inbox. Our concierge does the rest.
                    </p>

                    {/* halo + icons */}
                    <div className="inbox-art mx-auto">
                        <div className="inbox-halo"></div>

                        <div className="inbox-core shadow-sm">
                            <img src="/assets/img/kiki.png" alt="App logo" />
                        </div>

                        {/* orbiting icons */}
                        <div className="orbit icon ig">
                            <i className="bi bi-instagram"></i>
                        </div>
                        <div className="orbit icon fb">
                            <i className="bi bi-facebook"></i>
                        </div>
                        <div className="orbit icon wa">
                            <i className="bi bi-whatsapp"></i>
                        </div>
                        <div className="orbit icon sheets">
                            <i className="bi bi-file-earmark-spreadsheet"></i>
                        </div>
                        <div className="orbit icon csv">
                            <i className="bi bi-filetype-csv"></i>
                        </div>

                        {/* tiny avatar */}
                        <img className="orbit avatar" src="https://i.pravatar.cc/72?img=12" alt="Customer avatar" />
                    </div>

                    <div className="mt-4">
                        <a href="#" className="btn-kiki btn-primary btn btn-pill px-4">
                            Launch My First Campaign <i className="bi bi-send ms-1"></i>
                        </a>
                    </div>
                </div>
            </section>

            <section className="features-section py-5 py-lg-6">
                <div className="container-xxl">
                    <div className="features-wrap rounded-xxl p-5 text-center">
                        <h2 className="fw-bold display-6 mb-3">Kiki Features</h2>

                        <div className="d-flex justify-content-center">
                            <ul className="nav nav-pills feature-tabs justify-content-center gap-1 mb-5" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" type="button" role="tab">Manage Campaigns</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" type="button" role="tab">Email Lists</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" type="button" role="tab">Automation</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" type="button" role="tab">Analytics</button>
                                </li>
                            </ul>
                        </div>

                        {/* Feature stage */}
                        <div className="feature-stage mx-auto">
                            <div className="feature-screen shadow-lift">
                                <img src="/assets/img/campaign.png" alt="Kiki dashboard preview" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container d-flex flex-column align-items-center">
                <div className="heading demo-box">
                    <div className="play-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-play-fill"
                            viewBox="0 0 16 16">
                            <path d="M11.596 8.697l-6.363 3.692A.5.5 0 0 1 4.5 11.92V4.08a.5.5 0 0 1 .733-.442l6.363 3.692a.5.5 0 0 1 0 .866z" />
                        </svg>
                    </div>
                    <span>Watch full <span className="demo-video">Demo Video</span> Below</span>
                    <img src="/assets/img/arrow.png" alt="" className="arrow" />
                </div>

                {/* Video Player Container */}
                <div className="video-wrapper mt-4 position-relative">
                    <img src="/assets/img/video-modal.png" alt="Demo Video Screenshot" draggable="false" />
                    <div className="play-button-overlay" role="button" aria-label="Play Video" tabIndex={0}>
                        <svg className="play-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M11.596 8.697l-6.363 3.692A.5.5 0 0 1 4.5 11.92V4.08a.5.5 0 0 1 .733-.442l6.363 3.692a.5.5 0 0 1 0 .866z" />
                        </svg>
                    </div>
                </div>
            </div>

            <section className="analytics-section py-5">
                <div className="container-xxl">
                    <div className="analytics-wrap rounded-xxl px-lg-15  py-5 text-center text-white">
                        <h2 className="fw-bold mb-2">
                            Smarter <span className="text-warning">Emails</span>. Safer Data.
                        </h2>
                        <p className="text-white mb-5">
                            Kiki gives you analytics that make sense and security that keeps your emails safe — without extra
                            setup.
                        </p>

                        <div className="d-grid gap-4 gap-lg-5 text-start">

                            {/* Card 1 */}
                            <div className="feature-box p-3 p-lg-4 shadow-sm">
                                <div className="row align-items-center g-3 g-lg-4">
                                    <div className="col-md-5">
                                        <div className="screen">
                                            <img src="/assets/img/feature1.png" alt="Engagement score dashboard" loading="lazy" />
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <h5 className="fw-semibold mb-2 text-black">Engagement score simplified</h5>
                                        <p className="text-secondary mb-0">
                                            Auto-generate meaningful alternative text for thousands of images with a single
                                            click - saving your team hours of manual tagging. Perfect for ecommerce, media-heavy
                                            sites, and content-rich platforms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 (image on the right) */}
                            <div className="feature-box p-3 p-lg-4 shadow-sm">
                                <div className="row align-items-center g-3 g-lg-4 flex-md-row-reverse">
                                    <div className="col-md-5">
                                        <div className="screen">
                                            <img src="/assets/img/feature2.png" alt="Subscriber growth trends" loading="lazy" />
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <h5 className="fw-semibold mb-2 text-black">Subscriber growth trends</h5>
                                        <p className="text-secondary mb-0">
                                            Auto-generate meaningful alternative text for thousands of images with a single
                                            click - saving your team hours of manual tagging. Perfect for ecommerce, media-heavy
                                            sites, and content-rich platforms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="feature-box p-3 p-lg-4 shadow-sm">
                                <div className="row align-items-center g-3 g-lg-4">
                                    <div className="col-md-5">
                                        <div className="screen">
                                            <img src="/assets/img/feature3.png" alt="Encrypted data protection" loading="lazy" />
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <h5 className="fw-semibold mb-2 text-black">Encrypted data protection</h5>
                                        <p className="text-secondary mb-0">
                                            Auto-generate meaningful alternative text for thousands of images with a single
                                            click - saving your team hours of manual tagging. Perfect for ecommerce, media-heavy
                                            sites, and content-rich platforms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-primary py-5 ">
                <div className="container-xxl" data-scroller>
                    <div className="d-flex align-items-end justify-content-between mb-3">
                        <h2 className="fw-bold mb-0">Recent Blogs</h2>
                        <div className="d-none d-md-flex align-items-center gap-2">
                            <button className="scroll-btn btn btn-light border" type="button" data-dir="prev" aria-label="Scroll left">
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button className="scroll-btn btn btn-light border" type="button" data-dir="next" aria-label="Scroll right">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <div className="blog-scroller">
                        {/* Card 1 */}
                        <article className="blog-card blog-blue">
                            <div className="blog-content">
                                <h3 className="blog-title">5 Mistakes Beginners Make in Email Marketing</h3>
                                <span className="vline"></span>
                                <div className="brand-badge">
                                    <img src="/assets/img/logo.png" alt="KiKi" />
                                </div>
                            </div>
                            <div className="blog-media">
                                <img src="/assets/img/blog1.png" alt="Email marketing screen" />
                            </div>
                        </article>

                        {/* Card 2 (yellow with title bubble) */}
                        <article className="blog-card blog-yellow">
                            <div className="blog-content">
                                <h3 className="blog-title bubble-chip">Why Engagement Open Rate in 2025</h3>
                                <span className="vline dark"></span>
                                <div className="brand-badge">
                                    <img src="/assets/img/logo.png" alt="KiKi" />
                                </div>
                            </div>
                            <div className="blog-media">
                                <img src="/assets/img/blog2.png" alt="Analytics on laptop" />
                            </div>
                        </article>

                        {/* Card 3 */}
                        <article className="blog-card blog-indigo">
                            <div className="blog-content">
                                <h3 className="blog-title">How AI Writes Emails That Convert</h3>
                                <span className="vline"></span>
                                <div className="brand-badge">
                                    <img src="/assets/img/logo.png" alt="KiKi" />
                                </div>
                            </div>
                            <div className="blog-media">
                                <img src="/assets/img/blog3.png" alt="AI illustration" />
                            </div>
                        </article>
                        {/* Card 4 */}
                        <article className="blog-card blog-indigo">
                            <div className="blog-content">
                                <h3 className="blog-title">How AI Writes Emails That Convert</h3>
                                <span className="vline"></span>
                                <div className="brand-badge">
                                    <img src="/assets/img/logo.png" alt="KiKi" />
                                </div>
                            </div>
                            <div className="blog-media">
                                <img src="/assets/img/blog4.png" alt="AI illustration" />
                            </div>
                        </article>
                    </div>

                    {/* Mobile arrows */}
                    <div className="d-flex d-md-none justify-content-center gap-2 mt-3">
                        <button className="scroll-btn btn btn-light border" type="button" data-dir="prev" aria-label="Scroll left">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button className="scroll-btn btn btn-light border" type="button" data-dir="next" aria-label="Scroll right">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container-xxl">
                    <div className="pr-blend rounded-xxl p-4 p-lg-5">
                        <div className="row align-items-center gy-4">
                            <div className="col-lg-6">
                                <h2 className="fw-bold display-6 mb-3">Blend Your Campaign With PR</h2>
                                <p className="text-secondary mb-3">
                                    Why stop at inboxes? Amplify your email marketing with guaranteed PR placements on top media outlets.
                                    Turn every campaign into a headline, boost credibility, and reach audiences beyond your list.
                                </p>
                                <p className="text-secondary mb-4">
                                    With Kiki, your story travels further, faster, and with more authority.
                                </p>
                                <a href="#" className="btn btn-dark btn-pill">Get Started</a>
                            </div>

                            <div className="col-lg-6">
                                <div className="pr-art ms-lg-3">
                                    {/* soft arcs */}
                                    <span className="pr-blob blob-a" aria-hidden="true"></span>
                                    <span className="pr-blob blob-b" aria-hidden="true"></span>
                                    <span className="pr-blob blob-c" aria-hidden="true"></span>


                                </div>
                            </div>
                        </div>
                    </div>{/* /pr-blend */}
                </div>
            </section>

            <section className="py-5" id="pricing">
                <div className="container-xxl">
                    <div className="text-center mb-4">
                        <span className="badge rounded-pill bg-body-secondary text-body fw-semibold px-3 py-2">Pricing Plans</span>
                        <h2 className="fw-bold display-6 mt-3 mb-2">Find Your Perfect Plan</h2>
                        <p className="text-secondary mb-3">Choose the plan that grows with you. Start free, scale when you’re ready, cancel anytime.</p>

                        <div className="btn-group pricing-toggle" role="group" aria-label="Billing period">
                            <input type="radio" className="btn-check" name="billing" id="bill-monthly" defaultChecked />
                            <label className="btn btn-light border me-1" htmlFor="bill-monthly">Monthly</label>

                            <input type="radio" className="btn-check" name="billing" id="bill-yearly" />
                            <label className="btn btn-light border" htmlFor="bill-yearly">Yearly</label>
                        </div>
                        <div className="small text-secondary mt-2 pricing-save d-none">Save 15% when billed yearly</div>
                    </div>

                    <div className="row g-4 align-items-stretch">
                        <div className="col-md-6 col-lg-3">
                            <article className="plan-card h-100">
                                <div className="plan-top">
                                    <span className="plan-chip"><i className="bi bi-shield-check"></i></span>
                                    <h5 className="plan-name">Free</h5>
                                    <p className="plan-desc">Perfect for beginners testing email.</p>

                                    <div className="price-line">
                                        <span className="currency">$</span>
                                        <span className="price-amount" data-monthly="0" data-yearly="0">0</span>
                                        <span className="period">per month</span>
                                    </div>
                                </div>

                                <hr className="my-3" />
                                <ul className="plan-list">
                                    <li><i className="bi bi-check2-circle"></i> 500 emails</li>
                                    <li><i className="bi bi-check2-circle"></i> Extended Quota @ $0.005/email</li>
                                    <li><i className="bi bi-check2-circle"></i> 1 Campaign</li>
                                    <li><i className="bi bi-check2-circle"></i> Basic analytics</li>
                                </ul>

                                <a href="#" className="btn btn-outline-dark btn-pill w-100 mt-auto">Get Started</a>
                            </article>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <article className="plan-card plan-featured h-100 text-white">
                                <div className="plan-top">
                                    <span className="plan-chip soft"><i className="bi bi-rocket-takeoff"></i></span>
                                    <h5 className="plan-name">Solo</h5>
                                    <p className="plan-desc">Built for freelancers and side hustles.</p>

                                    <div className="price-line">
                                        <span className="currency">$</span>
                                        <span className="price-amount" data-monthly="0.99" data-yearly="0.85">0.99</span>
                                        <span className="period">per month</span>
                                    </div>
                                </div>

                                <hr className="my-3 border-light opacity-25" />
                                <ul className="plan-list">
                                    <li><i className="bi bi-check2-circle"></i> Everything in Free +</li>
                                    <li><i className="bi bi-check2-circle"></i> 2,000 emails</li>
                                    <li><i className="bi bi-check2-circle"></i> Extended Quota @ $0.002/email</li>
                                    <li><i className="bi bi-check2-circle"></i> 5 Campaigns</li>
                                    <li><i className="bi bi-check2-circle"></i> Engagement score</li>
                                    <li><i className="bi bi-check2-circle"></i> Smart templates</li>
                                    <li><i className="bi bi-check2-circle"></i> Basic automation</li>
                                    <li><i className="bi bi-check2-circle"></i> Support</li>
                                </ul>

                                <a href="#" className="btn btn-light btn-pill w-100 mt-auto">Get Started</a>
                            </article>
                        </div>

                        {/* MSME */}
                        <div className="col-md-6 col-lg-3">
                            <article className="plan-card h-100">
                                <div className="plan-top">
                                    <span className="plan-chip"><i className="bi bi-building"></i></span>
                                    <h5 className="plan-name">MSME</h5>
                                    <p className="plan-desc">For growing small businesses.</p>

                                    <div className="price-line">
                                        <span className="currency">$</span>
                                        <span className="price-amount" data-monthly="9.85" data-yearly="8.35">9.85</span>
                                        <span className="period">per month</span>
                                    </div>
                                </div>

                                <hr className="my-3" />
                                <ul className="plan-list">
                                    <li><i className="bi bi-check2-circle"></i> 20,000 emails</li>
                                    <li><i className="bi bi-check2-circle"></i> Extended Quota @ $0.001/email</li>
                                    <li><i className="bi bi-check2-circle"></i> Unlimited Campaigns</li>
                                    <li><i className="bi bi-check2-circle"></i> Concierge access (4 emails per month)</li>
                                    <li><i className="bi bi-check2-circle"></i> Advanced analytics</li>
                                    <li><i className="bi bi-check2-circle"></i> Campaign A/B testing</li>
                                </ul>

                                <a href="#" className="btn btn-outline-dark btn-pill w-100 mt-auto">Get Started</a>
                            </article>
                        </div>

                        {/* Business (dark) */}
                        <div className="col-md-6 col-lg-3">
                            <article className="plan-card plan-business h-100 text-white">
                                <div className="plan-top">
                                    <span className="plan-chip soft"><i className="bi bi-shield-lock"></i></span>
                                    <h5 className="plan-name">Business</h5>
                                    <p className="plan-desc">Serious power for scale.</p>

                                    <div className="price-line">
                                        <span className="currency">$</span>
                                        <span className="price-amount" data-monthly="56" data-yearly="48">56</span>
                                        <span className="period">per month</span>
                                    </div>
                                </div>

                                <hr className="my-3 border-light opacity-25" />
                                <ul className="plan-list">
                                    <li><i className="bi bi-check2-circle"></i> 100,000 emails</li>
                                    <li><i className="bi bi-check2-circle"></i> Extended Quota @ $0.001/email</li>
                                    <li><i className="bi bi-check2-circle"></i> Team accounts</li>
                                    <li><i className="bi bi-check2-circle"></i> Security compliance</li>
                                    <li><i className="bi bi-check2-circle"></i> Custom integrations</li>
                                    <li><i className="bi bi-check2-circle"></i> Concierge+ automation</li>
                                </ul>

                                <a href="#" className="btn btn-light btn-pill w-100 mt-auto">Get Started</a>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container-xxl">
                    <h2 className="fw-bold text-center mb-4">
                        See what others are saying about <span className="text-primary">Kiki.</span>
                    </h2>

                    <div className="t-wrap position-relative" data-scroller>
                        {/* arrows */}
                        <button className="t-arrow btn btn-light border" type="button" data-dir="prev" aria-label="Scroll left">
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <div className="t-scroller">
                            {/* Card 1 */}
                            <article className="t-card">
                                <p className="t-quote">
                                    ‘As a fashion designer I always struggled with juggling sewing, content creation, and responding to clients.
                                    Kiki solved that for me!’
                                </p>
                                <div className="t-author">
                                    <img src="https://i.pravatar.cc/80?img=5" alt="" />
                                    <div>
                                        <div className="t-name">Kelly</div>
                                        <div className="t-role">Fashion Designer</div>
                                    </div>
                                </div>
                            </article>

                            {/* Card 2 */}
                            <article className="t-card">
                                <p className="t-quote">
                                    I tried Kiki once and I was sold. It’s so easy to use and even better at responding to customers than I am 😂
                                </p>
                                <div className="t-author">
                                    <img src="https://i.pravatar.cc/80?img=15" alt="" />
                                    <div>
                                        <div className="t-name">David</div>
                                        <div className="t-role">Freelance Social media manager</div>
                                    </div>
                                </div>
                            </article>

                            {/* Card 3 */}
                            <article className="t-card">
                                <p className="t-quote">
                                    Our newsletter finally ships on time. Templates are clean, analytics make sense, and support is fast.
                                </p>
                                <div className="t-author">
                                    <img src="https://i.pravatar.cc/80?img=23" alt="" />
                                    <div>
                                        <div className="t-name">Alex</div>
                                        <div className="t-role">E‑commerce Owner</div>
                                    </div>
                                </div>
                            </article>

                            {/* Card 4 */}
                            <article className="t-card">
                                <p className="t-quote">
                                    The automations are simple but powerful. We recovered abandoned cart sales in the first week.
                                </p>
                                <div className="t-author">
                                    <img src="https://i.pravatar.cc/80?img=41" alt="" />
                                    <div>
                                        <div className="t-name">Maya</div>
                                        <div className="t-role">Store Manager</div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <button className="t-arrow t-arrow-right btn btn-light border" type="button" data-dir="next" aria-label="Scroll right">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container-xxl">
                    <div className="steps-wrap rounded-xxl  p-lg-5 text-center">
                        <h2 className="fw-bold mb-1">From zero to email marketing in</h2>
                        <h2 className="fw-bold mb-4"><span className="text-primary">3 simple steps</span></h2>

                        <div className="row g-4 mt-3 justify-content-center">
                            {/* Step 1 */}
                            <div className="col-md-6 col-lg-4">
                                <div className="step-card">
                                    <span className="step-badge">Step 1</span>
                                    <div className="step-screen shadow-sm">
                                        <div className="dz">
                                            <div className="dz-box">
                                                <img src="/assets/img/file-rep.png" className="file-rep" alt="" />
                                                <img src="/assets/img/user-add.png" className="user-add" alt="" />
                                                <div className="centralize mb-3 mt-3">
                                                    <img src="/assets/img/link-upload.png" className="upd" alt="file upload" />
                                                </div>
                                                <h6>Drag and drop here or choose a file</h6>
                                                <small>All doc, word, pdf, csv, xls file types are supported</small>
                                            </div>
                                            <div className="w-100 px-3">
                                                <button className="btn btn-primary w-100 btn-sm mt-3">Create Email List</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="step-caption">Upload contacts</div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="col-md-6 col-lg-4">
                                <div className="step-card">
                                    <span className="step-badge">Step 2</span>
                                    <div className="step-screen shadow-sm">
                                        <div className="ok text-center mt-4">
                                            <div className="display-6 mb-2 text-success"><i className="bi bi-check-circle-fill"></i></div>
                                            <div className="fw-semibold">Successful</div>
                                            <p className="small text-secondary mb-2">Your campaign has been created. Copy the link to share.</p>

                                            <div className="w-100 px-3">
                                                <button className="btn btn-primary w-100 btn-sm mt-3">Copy Link</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="step-caption">Approve campaign</div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="col-md-6 col-lg-4">
                                <div className="step-card">
                                    <span className="step-badge">Step 3</span>
                                    <div className="step-screen shadow-sm">
                                        <div className="bg-body-tertiary mt-4">
                                            <img src="/assets/img/step3.png" alt="" className="img-contain" />
                                        </div>
                                    </div>
                                    <div className="step-caption">Track result</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Three steps ends here */}


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
                                        <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#a1"
                                            aria-expanded="false" aria-controls="a1">
                                            Do I need marketing experience?
                                        </button>
                                    </h2>
                                    <div id="a1" className="accordion-collapse collapse" aria-labelledby="q1" data-bs-parent="#faq">
                                        <div className="accordion-body">
                                            Nope. Use our templates and guided flows—just add your brand and products.
                                        </div>
                                    </div>
                                </div>

                                {/* Q2 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="q2">
                                        <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#a2"
                                            aria-expanded="false" aria-controls="a2">
                                            How fast can I start?
                                        </button>
                                    </h2>
                                    <div id="a2" className="accordion-collapse collapse" aria-labelledby="q2" data-bs-parent="#faq">
                                        <div className="accordion-body">
                                            Import contacts, pick a template, hit send—most folks launch in under 15 minutes.
                                        </div>
                                    </div>
                                </div>

                                {/* Q3 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="q3">
                                        <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#a3"
                                            aria-expanded="false" aria-controls="a3">
                                            What makes Kiki different?
                                        </button>
                                    </h2>
                                    <div id="a3" className="accordion-collapse collapse" aria-labelledby="q3" data-bs-parent="#faq">
                                        <div className="accordion-body">
                                            Clear analytics, deliverability focus, and automation that’s simple enough for beginners.
                                        </div>
                                    </div>
                                </div>

                                {/* Q4 (open by default) */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="q4">
                                        <button className="accordion-button" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#a4"
                                            aria-expanded="true" aria-controls="a4">
                                            Can I cancel anytime?
                                        </button>
                                    </h2>
                                    <div id="a4" className="accordion-collapse collapse show" aria-labelledby="q4" data-bs-parent="#faq">
                                        <div className="accordion-body">
                                            Yes. No lock‑ins, no hidden fees.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* FAQ ends here */}
            <LandingFooterSecond/>
        </>
    )
}
