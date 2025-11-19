
import React from 'react'

export default function Pricing() {
    return (
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
    )
}
