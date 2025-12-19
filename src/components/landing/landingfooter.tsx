"use client";

export default function LandingFooterSecond() {
    return (
        <footer className="footer-dark pt-5 pb-4">
            <div className="container-xxl">
                <div className="row gy-5 align-items-start">
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center mb-3">
                            <img src="/assets/img/kiki.png" alt="KiKi logo" className="rounded-circle me-2" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                            <span className="h4 m-0 fw-bold text-white">KiKi</span>
                        </div>

                        <p className="text-white mb-4" style={{ maxWidth: 640 }}>
                            KiKi is the email marketing platform built for founders, beginners, and busy owners.
                            Launch campaigns in minutes, track only what matters, and grow without the overwhelm.
                            Simple, smart, and secure — the way email should be.
                        </p>

                        <h6 className="text-white mb-3">Stay Up To Date</h6>

                        <form className="subscribe-wrap" action="#" method="post" noValidate>
                            <div className="input-group subscribe-group">
                                <input type="email" className="form-control subscribe-input" placeholder="Enter Your Email"
                                    aria-label="Email address" />
                                <button className="btn btn-subscribe" type="submit">Subscribe</button>
                            </div>
                        </form>
                    </div>

                    {/* Nav */}
                    <div className="col-lg-6">
                        <ul className="nav justify-content-lg-end footer-nav">
                            <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Feature</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Pricing</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="footer-divider my-4" />

                {/* Bottom bar */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                    <div className="text-white small">
                        <span className="me-2">KiKi</span>
                        <i className="bi bi-c-circle me-1"></i>
                        <span id="year">{new Date().getFullYear()}</span> All rights reserved.
                        <div className="mt-1">
                            <a href="#" className="link-muted me-3">Privacy Policy</a>
                            <a href="#" className="link-muted">Terms of Service</a>
                        </div>
                    </div>

                    <ul className="list-unstyled d-flex align-items-center gap-2 m-0">
                        <li><a className="social" href="#" aria-label="Snapchat"><i className="bi bi-snapchat"></i></a></li>
                        <li><a className="social" href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a></li>
                        <li><a className="social" href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a></li>
                        <li><a className="social" href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a></li>
                        <li><a className="social" href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a></li>
                        <li><a className="social" href="#" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

