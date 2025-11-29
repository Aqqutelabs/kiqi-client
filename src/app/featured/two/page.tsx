'use client';
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import '../../kiki.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '@/components/landing/navbar';
import LandingFooterSecond from '@/components/landing/landingfooter';

export default function FeaturedTwo() {
    const year = new Date().getFullYear()

    useEffect(() => {
        let mounted = true
        const init = () => {
            try {
                const $ = window.$
                if (!$ || !$.fn || !$.fn.owlCarousel) return false

                if ($('#uxc-owl-carousel').length && !$('#uxc-owl-carousel').data('initialized')) {
                    $('#uxc-owl-carousel').owlCarousel({
                        loop: false,
                        margin: 18,
                        nav: true,
                        dots: false,
                        navText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
                        responsive: { 0: { items: 1 }, 576: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
                    }).data('initialized', true)
                }

                const $owl = $('#tst-owl')
                if ($owl.length && !$owl.data('initialized')) {
                    $owl.owlCarousel({
                        loop: true,
                        margin: 20,
                        nav: true,
                        dots: false,
                        navText: ['‹', '›'],
                        responsive: { 0: { items: 1 }, 576: { items: 1.2, stagePadding: 10 }, 768: { items: 2 }, 992: { items: 3 } }
                    }).data('initialized', true)

                    $('#tst-inline-prev').on('click', function () { $owl.trigger('prev.owl.carousel'); });
                    $('.tst-owl .owl-nav button').css('pointer-events', 'auto');
                    $owl.on('mouseover', function () { $owl.trigger('stop.owl.autoplay'); });
                }

                if ($('#kiqi-owl').length && !$('#kiqi-owl').data('initialized')) {
                    $('#kiqi-owl').owlCarousel({
                        items: 3,
                        loop: true,
                        margin: 20,
                        center: false,
                        responsive: { 0: { items: 1 }, 576: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
                    }).data('initialized', true)

                    $('.kiqi-arrow-left').on('click', function () { $('#kiqi-owl').trigger('prev.owl.carousel'); });
                }

                return true
            } catch (e) {
                return false
            }
        }

        const interval = setInterval(() => {
            if (!mounted) return
            const ok = init()
            if (ok) clearInterval(interval)
        }, 150)

        return () => {
            mounted = false
            clearInterval(interval)
        }
    }, [])

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
                <title>Kiki | Feature Page Two</title>
            </Head>
            
            <NavBar/>

            <main>
                <section className="py-4 py-lg-5">
                    <div className="featured-padded box3">
                        <div className="rounded-xxl px-4 px-lg-5">
                            <div className="row align-items-center gy-5">
                                <div className="col-lg-12">
                                    <h1 className="marketing-main light text-center mt-5 text-shaded">Email Marketing That Runs Itself</h1>
                                    <p className="lead mb-4 text-center text-white">We do the strategy, write the copy, set the schedule, and hit send. <br /> You just approve and watch results roll in.</p>

                                    <div className="centralize gap-3 mb-4 w-100">
                                        <a href="#" className="btn btn-white btn-pill">Get featured now <i className="bi bi-arrow-right ms-1" /></a>
                                        <a href="#" className="btn btn-outline-ice btn-pill"> See how it works </a>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <img src="/assets/img/em1.png" alt="" className="em-left" />
                                    <div className="photo-card email-market">
                                        <div className="centralize">
                                            <img src="/assets/img/marketing_bg.png" alt="Model wearing a blue sweater" loading="lazy" />
                                        </div>
                                    </div>
                                    <img src="/assets/img/em2.png" alt="" className="em-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted by founders */}
                <div className="tst-wrapper mt-5">
                    <h3 className="tst-heading">Some Brands We've Helped Feature</h3>
                    <div className="tst-logos" aria-hidden="true">
                        <img className="tst-logo" src="/assets/img/brand1.png" alt="brand1" />
                        <img className="tst-logo" src="/assets/img/brand2.png" alt="brand2" />
                        <img className="tst-logo" src="/assets/img/brand3.png" alt="brand3" />
                        <img className="tst-logo" src="/assets/img/brand4.png" alt="brand4" />
                        <img className="tst-logo" src="/assets/img/brand5.png" alt="brand5" />
                        <img className="tst-logo" src="/assets/img/brand6.png" alt="brand6" />
                    </div>
                </div>

                {/* Email Marketing section */}
                <section className="py-5 text-center">
                    <div className="container-xxl">
                        <h2 className="display-6 fw-bold mb-2">Why Email Marketing Matters</h2>
                        <p className="text-secondary mb-5">(For people who’ve never done it)</p>

                        <div className="sb-features px-5">
                            {/* Cards omitted for brevity in JSX but preserved in output — kept full for fidelity */}
                            <article className="sb-card" aria-labelledby="sb-title-1">
                                <div className="sb-icon" aria-hidden="true"><img src="/assets/img/wem1.png" alt="" /></div>
                                <div className="sb-content">
                                    <h3 id="sb-title-1" className="sb-title">Email = Direct Revenue.</h3>
                                    <p className="sb-desc">For every $1 spent on email marketing, businesses see an average <strong>$36 return</strong>.</p>
                                </div>
                            </article>

                            <article className="sb-card" aria-labelledby="sb-title-2">
                                <div className="sb-icon" aria-hidden="true"><img src="/assets/img/wem2.png" alt="" /></div>
                                <div className="sb-content">
                                    <h3 id="sb-title-2" className="sb-title">Own Your Audience.</h3>
                                    <p className="sb-desc">Unlike social media, <strong>your email list is yours</strong> — no algorithm changes, no reach drops.</p>
                                </div>
                            </article>

                            <article className="sb-card" aria-labelledby="sb-title-3">
                                <div className="sb-icon" aria-hidden="true"><img src="/assets/img/wem3.png" alt="" /></div>
                                <div className="sb-content">
                                    <h3 id="sb-title-3" className="sb-title">Build Trust.</h3>
                                    <p className="sb-desc">Regular, professional communication turns one-time buyers into repeat customers.</p>
                                </div>
                            </article>

                            <article className="sb-card" aria-labelledby="sb-title-4">
                                <div className="sb-icon" aria-hidden="true"><img src="/assets/img/wem4.png" alt="" /></div>
                                <div className="sb-content">
                                    <h3 id="sb-title-4" className="sb-title">Automation = Freedom.</h3>
                                    <p className="sb-desc">Set up once, and emails keep working while you sleep.</p>
                                </div>
                            </article>

                            <article className="sb-card" aria-labelledby="sb-title-5">
                                <div className="sb-icon" aria-hidden="true"><img src="/assets/img/wem5.png" alt="" /></div>
                                <div className="sb-content">
                                    <h3 id="sb-title-5" className="sb-title">Measurable Results.</h3>
                                    <p className="sb-desc">See exactly how many subscribers opened, clicked, and bought.</p>
                                </div>
                            </article>

                            <article className="sb-card sb-highlight">
                                <p className="mb-1" style={{ marginBottom: '0.1rem' }}>
                                    <span className="sb-pointer">👉</span>
                                    <small className="text-muted">If you've never run email before, this is the simplest way to start —</small>
                                </p>
                                <h3 className="sb-title"><strong>and the fastest way to see results.</strong></h3>
                                <img src="/assets/img/wem6.png" alt="Person holding phone" />
                            </article>

                        </div>
                    </div>
                </section>

                {/* Remaining content sections: How Concierge Works, Features, blend panel, hero benefits, testimonials, more benefits, FAQ, footer */}

                <section className="col-lg-12">
                    <header className="mb-3"><h2 className="section-title">How Concierge Works</h2></header>
                    <div className="row w-100 p-4">
                        <div className="col-12 col-md-6">
                            <article className="big-card">
                                <div>
                                    <h3>Upload or share contacts.</h3>
                                    <p className="muted-small">We handle spreadsheets, CSVs, or manual entry.</p>
                                </div>
                                <div>
                                    <figure className="photo-wrap">
                                        <img src="/assets/img/handed-icon.png" className="iconed" alt="" />
                                        <img src="/assets/img/lady.png" alt="" />
                                    </figure>
                                </div>
                            </article>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="row">
                                <div className="col-sm-6">
                                    <article className="small-card bg-green">
                                        <img src="/assets/img/bulb-user.png" alt="" className="illustration mb-4" />
                                        <div className="flex-grow-1">
                                            <h4>Tell us your goal.</h4>
                                            <p className="mb-2">Sales, leads, awareness — we design the right campaign.</p>
                                        </div>
                                    </article>
                                </div>

                                <div className="col-12 col-sm-6">
                                    <article className="small-card bg-pink">
                                        <img src="/assets/img/user-raise.png" alt="" className="illustration mb-3" />
                                        <div className="flex-grow-1 mb-3">
                                            <h4>Approve and relax.</h4>
                                            <p>We draft, design, and schedule emails. You approve before sending.</p>
                                        </div>
                                    </article>
                                </div>

                                <div className="col-12">
                                    <article className="card-white mt-3">
                                        <div className="white-inner">
                                            <img src="/assets/img/user-pic.png" alt="user picture" />
                                            <div className="white-text">
                                                <h4>Track only what matters.</h4>
                                                <p>No confusing dashboards. Just see how many emails were sent, who engaged, and what sales came in.</p>
                                            </div>
                                        </div>
                                    </article>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-lg-12 mt-5 mb-3">
                    <header className="mb-3"><h2 className="section-title">Concierge Features</h2></header>

                    <div className="col-lg-12 p-5">
                        <div className="row w-100">
                            <div className="col-lg-5 p-3">
                                <div className="cc-feature gradient-blue">
                                    <img src="/assets/img/cf1.png" alt="feature 1" />
                                    <h4 className="cf-title">Campaign Strategy</h4>
                                    <p className="cf-desc">we plan the right sequence for your audience</p>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="cc-feature mt-3">
                                    <div className="row">
                                        <div className="col-lg-4"><img src="/assets/img/cf2.png" alt="feature 1" /></div>
                                        <div className="col-lg-8 d-flex justify-content-center align-items-center">
                                            <div className="p-5">
                                                <h4 className="cf-title">Campaign Strategy</h4>
                                                <p className="cf-desc">we plan the right sequence for your audience</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional feature rows (kept as in original) */}
                    <div className="col-lg-12 p-5 mt--10">
                        <div className="row w-100">
                            <div className="col-lg-7">
                                <div className="cc-feature mt-3">
                                    <div className="row">
                                        <div className="col-lg-4"><img src="/assets/img/cf3.png" alt="feature 1" /></div>
                                        <div className="col-lg-8 d-flex justify-content-center align-items-center">
                                            <div className="p-5">
                                                <h4 className="cf-title">Design & Templates</h4>
                                                <p className="cf-desc">Beautiful, mobile-ready layouts that look professional</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-5 p-3">
                                <div className="cc-feature gradient-blue">
                                    <img src="/assets/img/cf4.png" alt="feature 1" />
                                    <h4 className="cf-title">Smart Scheduling</h4>
                                    <p className="cf-desc">Emails sent when your audience is most likely to open</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12 p-5 mt--10">
                        <div className="row w-100">
                            <div className="col-lg-5 p-3">
                                <div className="cc-feature gradient-blue">
                                    <img src="/assets/img/cf4.png" alt="feature 1" />
                                    <h4 className="cf-title">Engagement score</h4>
                                    <p className="cf-desc">simple star rating that tells you if it's working.</p>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="cc-feature mt-3">
                                    <div className="row">
                                        <div className="col-lg-4"><img src="/assets/img/cf3.png" alt="feature 1" /></div>
                                        <div className="col-lg-8 d-flex justify-content-center align-items-center">
                                            <div className="p-5">
                                                <h4 className="cf-title">Optional Add-ons</h4>
                                                <p className="cf-desc">Funnels, landing pages, automations as you grow.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <div className="vis-panel blend" style={{ marginTop: 80, marginBottom: 80 }}>
                    <div className="vis-row">
                        <div className="vis-copy">
                            <h1 className="vis-title"><b>Blend your campaign with PR</b></h1>
                            <p className="vis-lead">Why stop at inboxes? Amplify your email marketing with guaranteed PR placements on top media outlets. Turn every campaign into a headline, boost credibility, and reach audiences beyond your list. With Kiki, your story travels further, faster, and with more authority.</p>
                            <div className="vis-cta-group"><button className="prms-cta">Get Started</button></div>
                        </div>

                        <div className="vis-visual">
                            <div className="vis-photo"><img src="/assets/img/cf-feature.png" alt="Hero image" /></div>
                        </div>

                    </div>
                </div>

                <section className="kiqi-hero">
                    <div className="container text-center text-white">
                        <h2 className="kiqi-title">Real Benefits You’ll See</h2>

                        <div className="kiqi-features">
                            <div className="kiqi-feature">
                                <div className="icon"><img src="/assets/img/benefit1.png" alt="" /></div>
                                <h5>Sell More, Automatically —</h5>
                                <p>Drip campaigns nurture leads until they're ready to buy.</p>
                            </div>

                            <div className="kiqi-feature">
                                <div className="icon"><img src="/assets/img/benefit2.png" alt="" /></div>
                                <h5>Higher Engagement —</h5>
                                <p>A/B testing helps you discover what your audience actually clicks.</p>
                            </div>

                            <div className="kiqi-feature">
                                <div className="icon"><img src="/assets/img/benefit3.png" alt="" /></div>
                                <h5>Save Time —</h5>
                                <p>No dashboards, no writing, no stress. We do it.</p>
                            </div>

                            <div className="w-100" />

                            <div className="kiqi-feature kiqi-feature--center">
                                <div className="icon"><img src="/assets/img/benefit4.png" alt="" /></div>
                                <h5>Professional Look —</h5>
                                <p>Your brand looks like a big player, even if you're just starting out.</p>
                            </div>

                            <div className="kiqi-feature kiqi-feature--center">
                                <div className="icon"><img src="/assets/img/benefit5.png" alt="" /></div>
                                <h5>Scalable Growth —</h5>
                                <p>Start small, and scale up as your business grows.</p>
                            </div>

                        </div>

                        <div className="kiqi-decor-icon kiqi-decor-1" />
                        <div className="kiqi-decor-icon kiqi-decor-2" />

                        <div className="kiqi-testimonials">
                            <div className="kiqi-arrow-left">◀</div>
                            <div className="owl-carousel owl-theme" id="kiqi-owl">
                                <div className="item">
                                    <div className="kiqi-testimonial-card">
                                        <p>“I never knew email could be this easy. Kiqi handled everything and I made back my subscription in 2 weeks.”</p>
                                        <div className="meta">
                                            <img src="https://i.pravatar.cc/100?img=12" alt="Tunde avatar" />
                                            <div><span className="name">Tunde</span><span className="role">Startup Founder</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="kiqi-testimonial-card">
                                        <p>“I don't have time for dashboards. Concierge just works — my campaigns run while I work on my business.”</p>
                                        <div className="meta">
                                            <img src="https://i.pravatar.cc/100?img=5" alt="Lara avatar" />
                                            <div><span className="name">Lara</span><span className="role">Agency Owner</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="kiqi-testimonial-card">
                                        <p>“The engagement score is genius. I understand my results at a glance, without digging through numbers.”</p>
                                        <div className="meta">
                                            <img src="https://i.pravatar.cc/100?img=3" alt="Chuka avatar" />
                                            <div><span className="name">Chuka</span><span className="role">Ecommerce Reseller</span></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                <div className="mc-page">
                    <div className="container">
                        <h2 className="mc-heading">More Concierge Benefits</h2>

                        <div className="mc-top row g-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="mc-benefits-card mc-bg-pale">
                                    <div className="mc-benefit-item">
                                        <div className="mc-badge"><i className="bi bi-rocket-fill" style={{ fontSize: 18 }} /></div>
                                        <div>
                                            <p className="mc-benefit-title">Launch in 48 Hours</p>
                                            <p className="mc-benefit-desc">Campaigns live almost instantly.</p>
                                        </div>
                                    </div>

                                    <div className="mc-benefit-item">
                                        <div className="mc-badge"><i className="bi bi-hand-index-thumb" style={{ fontSize: 18 }} /></div>
                                        <div>
                                            <p className="mc-benefit-title">Hands–Off Execution</p>
                                            <p className="mc-benefit-desc">Strategy + copy + scheduling done for you.</p>
                                        </div>
                                    </div>

                                    <div className="mc-benefit-item">
                                        <div className="mc-badge"><i className="bi bi-people-fill" style={{ fontSize: 18 }} /></div>
                                        <div>
                                            <p className="mc-benefit-title">Scale Without Hiring</p>
                                            <p className="mc-benefit-desc">No need for a marketer, designer, or copywriter.</p>
                                        </div>
                                    </div>

                                    <div className="mc-benefit-item">
                                        <div className="mc-badge"><i className="bi bi-plus-square-fill" style={{ fontSize: 18 }} /></div>
                                        <div>
                                            <p className="mc-benefit-title">Optional Add–Ons</p>
                                            <p className="mc-benefit-desc">Landing pages, funnels, and automations when you’re ready.</p>
                                        </div>
                                    </div>

                                    <div className="mc-benefit-item">
                                        <div className="mc-badge"><i className="bi bi-check2-square" style={{ fontSize: 18 }} /></div>
                                        <div>
                                            <p className="mc-benefit-title">One–Click Approvals</p>
                                            <p className="mc-benefit-desc">Review campaigns in minutes, not hours.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mc-right-graphic">
                                    <img src="/assets/img/more1.png" alt="concierge visual" className="mc-person-photo" />
                                </div>
                            </div>
                        </div>

                        <div className="mc-banner mc-main-blue mt-5">
                            <div className="mc-banner-left">
                                <div className="mc-title">Stop Wasting Time<br /><span style={{ opacity: 0.95 }}>Start Sending Emails<br />That Sell.</span></div>
                                <p className="mc-sub">Email marketing is the channel with the highest ROI. Don't learn it. Don't hire for it. Just approve and grow.</p>
                                <button className="btn mc-add-btn mc-btn-blue">Add Concierge to My Plan</button>
                            </div>
                            <div className="mc-banner-right"><img src="/assets/img/more2.png" alt="" /></div>
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
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q1">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a1" aria-expanded="false" aria-controls="a1">Do I need marketing experience?</button>
                                        </h2>
                                        <div id="a1" className="accordion-collapse collapse" aria-labelledby="q1" data-bs-parent="#faq"><div className="accordion-body">Nope. Use our templates and guided flows—just add your brand and products.</div></div>
                                    </div>

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q2">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a2" aria-expanded="false" aria-controls="a2">How fast can I start?</button>
                                        </h2>
                                        <div id="a2" className="accordion-collapse collapse" aria-labelledby="q2" data-bs-parent="#faq"><div className="accordion-body">Import contacts, pick a template, hit send—most folks launch in under 15 minutes.</div></div>
                                    </div>

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q3">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a3" aria-expanded="false" aria-controls="a3">What makes Kiki different?</button>
                                        </h2>
                                        <div id="a3" className="accordion-collapse collapse" aria-labelledby="q3" data-bs-parent="#faq"><div className="accordion-body">Clear analytics, deliverability focus, and automation that’s simple enough for beginners.</div></div>
                                    </div>

                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="q4">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#a4" aria-expanded="true" aria-controls="a4">Can I cancel anytime?</button>
                                        </h2>
                                        <div id="a4" className="accordion-collapse collapse show" aria-labelledby="q4" data-bs-parent="#faq"><div className="accordion-body">Yes. No lock‑ins, no hidden fees.</div></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <LandingFooterSecond/>
        </>
    )
}
