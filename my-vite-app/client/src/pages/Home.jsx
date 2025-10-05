

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCookies } from "react-cookie";
import Navbar from "../component/Navbar";
import Authmodal from "../component/Authmodal";
import "./Home.css";

const testimonialsData = [
  {
    initials: "S&J",
    title: "Sarah & James",
    subtitle: "Matched through Rock Music",
    text:
      "We connected over our shared love for classic rock. Our first date was at a local rock concert, and we've been inseparable ever since!",
    meta: "Together for 2 years",
  },
  {
    initials: "M&A",
    title: "Mike & Alice",
    subtitle: "Connected via Jazz",
    text:
      "Our mutual appreciation for jazz brought us together. We had our first dance to 'What a Wonderful World' at our wedding!",
    meta: "Married for 1 year",
  },
  {
    initials: "D&E",
    title: "David & Emma",
    subtitle: "United by EDM",
    text:
      "We met at an EDM festival after matching on MusicMatch. Now we travel to music festivals together around the world!",
    meta: "Together for 3 years",
  },
];

export default function Home() {
  // Cookies & auth (kept same behavior as your app)
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [showModal, setshowModal] = useState(false);
  const [isSignUp, setisSignUp] = useState(true);
  const authToken = cookies.AuthToken;

  // FAQ states: track which answer is open (index or null)
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Testimonials carousel
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialsRef = useRef(null);

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Contact form state (simple controlled behavior)
  const contactFormRef = useRef(null);

  useEffect(() => {
    // Auto-rotate testimonials every 6s
    const t = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Scroll listener for scroll-to-top button
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update carousel translate when index changes
  useEffect(() => {
    const track = testimonialsRef.current;
    if (!track) return;
    const width = track.clientWidth;
    track.style.transform = `translateX(-${testimonialIndex * width}px)`;
  }, [testimonialIndex]);

  // Contact form submit handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // keep it simple: show the same alert as in original HTML
    alert("Thank you for your message! We will get back to you soon.");
    if (contactFormRef.current) contactFormRef.current.reset();
  };

  // FAQ toggle handler
  const toggleFaq = (idx) => {
    setOpenFaqIndex((curr) => (curr === idx ? null : idx));
  };

  // Sign up / sign out button behavior (keeps your logic)
  const handlePrimaryClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setshowModal(true);
    setisSignUp(true);
  };

  // Carousel previous / next
  const prevTestimonial = () =>
    setTestimonialIndex((i) => Math.max(0, i - 1));
  const nextTestimonial = () =>
    setTestimonialIndex((i) => Math.min(testimonialsData.length - 1, i + 1));

  // Scroll to top
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      {/* Navbar - preserved as requested */}
      <Navbar
        authToken={authToken}
        minimal={false}
        setshowModal={setshowModal}
        showModal={showModal}
        setisSignUp={setisSignUp}
      />

      {/* HERO SECTION */}
      <header id="hero" className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-heading">
              Find Your Perfect <span className="accent">Rhythm</span> in Love
            </h1>
            <p className="hero-lead">
              Connect with people who share your musical taste. Because the best relationships start with a shared playlist.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary pulse" onClick={handlePrimaryClick}>
                {authToken ? "Sign Out" : "Start Matching"}
              </button>
              <button className="btn btn-outline" onClick={() => window.location.hash = "#howItWorks"}>
                Learn More
              </button>
            </div>

            <div className="hero-mini">
              <div className="mini-avatars">
                <div className="mini-dot">🎵</div>
                <div className="mini-dot">🎸</div>
                <div className="mini-dot">🎹</div>
              </div>
              <p className="mini-text">Join 10,000+ music lovers finding their match</p>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-preview-glow" />
            <div className="hero-preview">
              <div className="preview-grid">
                <div className="preview-block" />
                <div className="preview-block delay-1"  />
                <div className="preview-block delay-2" />
                <div className="preview-block delay-3" />
              </div>

              <div className="preview-play">
                <div className="play-circle">
                  <svg viewBox="0 0 24 24" className="play-icon" fill="none" stroke="currentColor">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom-fade" />
      </header>

      {/* HOW IT WORKS */}
      <section id="howItWorks" className="section white">
        <div className="container">
          <div className="section-head center">
            <h2>How MusicMatch Works</h2>
            <p>Find your perfect match in three simple steps</p>
          </div>

          <div className="grid-3">
            <div className="step card">
              <div className="icon-circle">1</div>
              <h4>Share Your Music</h4>
              <p>Connect your favorite streaming service and show off your musical taste.</p>
            </div>

            <div className="step card">
              <div className="icon-circle">2</div>
              <h4>Get Matched</h4>
              <p>Our algorithm finds people who share your musical preferences and vibes.</p>
            </div>

            <div className="step card">
              <div className="icon-circle">3</div>
              <h4>Start Chatting</h4>
              <p>Connect with your matches and discover shared musical interests.</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat">
              <h3>50K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat">
              <h3>1M+</h3>
              <p>Matches Made</p>
            </div>
            <div className="stat">
              <h3>10K+</h3>
              <p>Success Stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section dark">
        <div className="container">
          <div className="section-head center white">
            <h2>Premium Features</h2>
            <p>Everything you need to find your musical soulmate</p>
          </div>

          <div className="features-grid">
            <div className="feature card">
              <div className="feature-icon">🎯</div>
              <h4>Music Compatibility Score</h4>
              <p>Advanced algorithm that matches users based on genre preferences, favorite artists, and listening habits.</p>
            </div>

            <div className="feature card">
              <div className="feature-icon">🎧</div>
              <h4>Shared Playlists</h4>
              <p>Create and share collaborative playlists with your matches to discover new music together.</p>
            </div>

            <div className="feature card">
              <div className="feature-icon">🎟️</div>
              <h4>Live Concert Matching</h4>
              <p>Find matches who are attending the same concerts and music festivals as you.</p>
            </div>

            <div className="feature card">
              <div className="feature-icon">💬</div>
              <h4>Music Chat Rooms</h4>
              <p>Join genre-specific chat rooms to discuss music and connect with like-minded individuals.</p>
            </div>

            <div className="feature card">
              <div className="feature-icon">✅</div>
              <h4>Music Profile Verification</h4>
              <p>Verified music taste profiles to ensure authentic connections and matching.</p>
            </div>

            <div className="feature card">
              <div className="feature-icon">✨</div>
              <h4>Music Discovery Feed</h4>
              <p>Personalized feed showing potential matches based on your evolving music taste.</p>
            </div>
          </div>

          <div className="center">
            <button className="btn btn-primary pulse">Explore All Features</button>
          </div>
        </div>
      </section>

      {/* PREFERENCES / ONBOARDING */}
      <section id="musicPreferences" className="section white">
        <div className="container">
          <div className="section-head center">
            <h2>Set Your Music Preferences</h2>
            <p>Tell us what moves you, and we'll find your perfect harmony</p>
          </div>

          <div className="grid-2 gap-12">
            <div>
              <div className="card pale">
                <h4>Favorite Genres</h4>
                <div className="tag-row">
                  {["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic"].map((g) => (
                    <button key={g} className="tag">{g}</button>
                  ))}
                </div>
              </div>

              <div className="card pale mt-6">
                <h4>Music Era Preference</h4>
                <input type="range" min="0" max="100" className="range"/>
                <div className="era-legend">
                  <span>60s</span><span>70s</span><span>80s</span><span>90s</span><span>00s</span><span>10s</span><span>20s</span>
                </div>
              </div>

              <div className="card pale mt-6">
                <h4>Streaming Services</h4>
                <div className="stream-row">
                  <button className="stream">Spotify</button>
                  <button className="stream">Apple Music</button>
                </div>
              </div>
            </div>

            <div>
              <div className="card onboarding-profile">
                <h4>Your Music Profile</h4>
                <p>Complete your profile to get better matches</p>
                <div className="profile-progress">
                  <div className="progress-row">
                    <span>Profile Completion</span>
                    <span className="rose">75%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: "75%"}}/>
                  </div>
                  <button className="btn btn-primary full mt-6">Connect More Services</button>
                  <p className="muted small">Connected profiles get 5x more matches!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="section dark">
        <div className="container">
          <div className="section-head center white">
            <h2>Join Our Musical Community</h2>
            <p>Connect with music lovers from around the world</p>
          </div>

          <div className="grid-2 gap-12 vcenter">
            <div className="community-cards">
              <div className="card dark hover-scale">
                <h4>Music Chat Rooms</h4>
                <p>Join genre-specific chat rooms and discuss your favorite music with like-minded individuals</p>
              </div>
              <div className="card dark hover-scale mt-6">
                <h4>Live Events</h4>
                <p>Virtual concerts, listening parties, and music sharing sessions with community members</p>
              </div>
              <div className="card dark hover-scale mt-6">
                <h4>Collaborative Playlists</h4>
                <p>Create and share playlists with the community, discover new music together</p>
              </div>
            </div>

            <div className="card dark stats-box">
              <h4>Community Stats</h4>
              <div className="grid-2 stats-grid">
                <div className="stat-box"><div className="big rose">50K+</div><div className="muted">Active Members</div></div>
                <div className="stat-box"><div className="big rose">1000+</div><div className="muted">Daily Events</div></div>
                <div className="stat-box"><div className="big rose">500+</div><div className="muted">Music Groups</div></div>
                <div className="stat-box"><div className="big rose">10K+</div><div className="muted">Shared Playlists</div></div>
              </div>

              <div className="center mt-6">
                <button className="btn btn-primary pulse">Join Community Now</button>
                <p className="muted small mt-2">Join today and get 1 month free access to premium features</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES (TESTIMONIALS) */}
      <section id="successStories" className="section dark">
        <div className="container">
          <div className="section-head center white">
            <h2>Success Stories</h2>
            <p>Real couples who found love through music</p>
          </div>

          <div className="testimonials-wrap">
            <div className="testimonials-track" ref={testimonialsRef}>
              {testimonialsData.map((t, i) => (
                <div className="testimonial card" key={i}>
                  <div className="testimonial-top">
                    <div className="badge">{t.initials}</div>
                    <div>
                      <h4 className="white">{t.title}</h4>
                      <div className="muted small">{t.subtitle}</div>
                    </div>
                  </div>
                  <p className="muted">{t.text}</p>
                  <div className="meta rose small">{t.meta}</div>
                </div>
              ))}
            </div>

            <div className="testimonials-nav">
              <button className="nav-btn" onClick={prevTestimonial}>◀</button>
              <button className="nav-btn" onClick={nextTestimonial}>▶</button>
            </div>
          </div>
        </div>
      </section>

     

      {/* CONTACT */}
      <section id="contact" className="section dark">
        <div className="container">
          <div className="section-head center white">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you</p>
          </div>

          <div className="grid-2 gap-12">
            <form className="card contact-form" id="contactForm" ref={contactFormRef} onSubmit={handleContactSubmit}>
              <label>Name</label>
              <input type="text" name="name" placeholder="Your name" required />

              <label>Email</label>
              <input type="email" name="email" placeholder="your@email.com" required />

              <label>Subject</label>
              <select name="subject" required defaultValue="">
                <option value="" disabled>Select a subject</option>
                <option value="support">Technical Support</option>
                <option value="membership">Membership Inquiry</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="other">Other</option>
              </select>

              <label>Message</label>
              <textarea name="message" rows="4" placeholder="Your message..." required />

              <button className="btn btn-primary full" type="submit">Send Message</button>
            </form>

            <div className="contact-info">
              <div className="card dark">
                <h4>Email Us</h4>
                <p className="muted">support@musicmatch.com</p>
              </div>

              <div className="card dark mt-6">
                <h4>Live Chat</h4>
                <p className="muted">Available 24/7</p>
              </div>

              <div className="card dark mt-6">
                <h4>Follow Us</h4>
                <div className="social-row">
                  <button className="social">F</button>
                  <button className="social">T</button>
                  <button className="social">I</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING (excerpt) */}
      <section id="pricing" className="section white">
        <div className="container">
          <div className="section-head center">
            <h2>Choose Your Rhythm</h2>
            <p>Select the perfect plan to start your musical journey</p>
          </div>

          <div className="grid-3 gap-8">
            <div className="card pricing">
              <h3>Free</h3>
              <div className="price"><span className="big">$0</span><span className="muted">/month</span></div>
              <ul className="features-list">
                <li>Basic Profile Creation</li>
                <li>5 Daily Matches</li>
                <li>Basic Music Integration</li>
              </ul>
              <button className="btn btn-outline full">Get Started</button>
            </div>

            <div className="card pricing featured">
              <span className="badge">Popular</span>
              <h3>Premium</h3>
              <div className="price"><span className="big">$14.99</span><span className="muted">/month</span></div>
              <ul className="features-list muted">
                <li>All Free Features</li>
                <li>Unlimited Matches</li>
                <li>Advanced Music Analysis</li>
                <li>Concert Match Alerts</li>
                <li>Priority Support</li>
              </ul>
              <button className="btn btn-primary full pulse">Go Premium</button>
            </div>

            <div className="card pricing">
              <h3>VIP</h3>
              <div className="price"><span className="big">$29.99</span><span className="muted">/month</span></div>
              <ul className="features-list">
                <li>All Premium Features</li>
                <li>VIP Badge</li>
                <li>Personal Matchmaker</li>
                <li>Exclusive Events Access</li>
              </ul>
              <button className="btn btn-outline full">Get VIP Access</button>
            </div>
          </div>

          <div className="muted center mt-6">All plans include 7-day free trial. Cancel anytime.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer dark">
        <div className="container footer-grid">
          <div>
            <h3 className="logo">MusicMatch</h3>
            <p className="muted">Connecting hearts through the power of music. Find your perfect harmony in love.</p>
            <div className="social-row">
              <button className="social">F</button>
              <button className="social">T</button>
              <button className="social">I</button>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="muted">
              <li><a href="#howItWorks">How It Works</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul className="muted">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4>Stay Updated</h4>
            <p className="muted">Subscribe to our newsletter for updates and special offers.</p>
            <form className="newsletter">
              <input type="email" placeholder="Your email" />
              <button className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="muted small">© 2024 MusicMatch. All rights reserved.</p>
          <div className="footer-links muted small">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>

        <button
          id="scrollToTop"
          className={`scroll-top ${showScrollTop ? "visible" : ""}`}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </footer>

      {showModal && <Authmodal setshowModal={setshowModal} isSignUp={isSignUp} />}
    </motion.div>
  );
}
