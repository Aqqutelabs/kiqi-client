"use client";

export default function NavBar() {

    return (
        <nav className="topbar navbar navbar-expand-lg navbar-light bg-white py-3">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img src="/assets/img/logo.png" alt="" />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="/">
                                Home
                            </a>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Feature
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="/featured/one">
                                        Feature 1
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/featured/two">
                                        Feature 2
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/featured/three">
                                        Feature 3
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Services
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Service 1
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Service 2
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Service 3
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Pricing
                            </a>
                        </li>
                    </ul>

                    <div className="d-flex">
                        <a href="/login" className="btn btn-sign-in">Sign In</a>
                        <a href="/signup" className="btn btn-get-started">Get Started</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}



