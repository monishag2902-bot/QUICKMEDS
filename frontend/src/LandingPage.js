import React, { useState } from "react";

function LandingPage({ onGetStarted }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = () => {
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="landing-page">
      {/* ========== HERO SECTION ========== */}
      <section className="hero">
        <div className="hero-content">
          <h1>💊 Medicine delivery made simple</h1>
          <p>
            Fast, reliable pharmacy services with real-time tracking. Get your medicines delivered right to your door.
          </p>
          <button className="cta-button primary" onClick={onGetStarted}>
            Get Started Free →
          </button>
          <p className="hero-subtitle">No credit card required • 24/7 support</p>
        </div>
        <div className="hero-image">
          <div className="phone-mockup">📱</div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="features">
        <h2>Simple pharmacy management</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Order Medicines</h3>
            <p>Browse our complete catalog and order exactly what you need in seconds.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Get your medicines delivered quickly with real-time tracking updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Easy Registration</h3>
            <p>Create an account in seconds and start ordering immediately.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable Pricing</h3>
            <p>Transparent pricing with no hidden fees. Pay exactly what you see.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Always Available</h3>
            <p>Access QuickMeds anytime, anywhere. Our service never closes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safe & Secure</h3>
            <p>Your data is encrypted and protected. We prioritize your privacy.</p>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="stats">
        <div className="stat-item">
          <h3>5K+</h3>
          <p>People trust QuickMeds</p>
        </div>
        <div className="stat-item">
          <h3>50K+</h3>
          <p>Orders delivered successfully</p>
        </div>
        <div className="stat-item">
          <h3>98%</h3>
          <p>Customer satisfaction rate</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Support always available</p>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section className="how-it-works">
        <h2>How QuickMeds works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Register</h4>
            <p>Sign up with your email in seconds</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Browse</h4>
            <p>Search for medicines you need</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Order</h4>
            <p>Place your order in seconds</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Receive</h4>
            <p>Get delivered to your door</p>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="testimonials">
        <h2>What our customers say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>
              "QuickMeds is incredibly convenient. I ordered my medicines and received them the same day. Great service!"
            </p>
            <h4>Sarah Mohammed</h4>
            <span>Mumbai, India</span>
          </div>
          <div className="testimonial">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>
              "The app is so easy to use. I love that I can track my delivery in real-time. Highly recommended!"
            </p>
            <h4>Rajesh Kumar</h4>
            <span>Bangalore, India</span>
          </div>
          <div className="testimonial">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>
              "Best pharmacy service I've used. Fast, reliable, and the customer support is fantastic. Will definitely order again."
            </p>
            <h4>Priya Sharma</h4>
            <span>Delhi, India</span>
          </div>
        </div>
      </section>

      {/* ========== Blog/News SECTION ========== */}
      <section className="blog">
        <h2>Health tips & news</h2>
        <div className="blog-grid">
          <article className="blog-card">
            <div className="blog-tag">Health</div>
            <h4>5 Tips for Storing Medicines Safely at Home</h4>
            <p>Learn the best practices for keeping your medicines fresh and effective...</p>
            <a href="#read-more" style={{ color: "#5fb3d5", textDecoration: "none", fontWeight: "500" }}>
              Read more →
            </a>
          </article>
          <article className="blog-card">
            <div className="blog-tag">Wellness</div>
            <h4>Understanding Your Medicine Labels</h4>
            <p>A guide to reading and understanding pharmaceutical labels safely...</p>
            <a href="#read-more" style={{ color: "#5fb3d5", textDecoration: "none", fontWeight: "500" }}>
              Read more →
            </a>
          </article>
          <article className="blog-card">
            <div className="blog-tag">News</div>
            <h4>QuickMeds Launches New Express Delivery</h4>
            <p>We're excited to announce same-day delivery in major cities...</p>
            <a href="#read-more" style={{ color: "#5fb3d5", textDecoration: "none", fontWeight: "500" }}>
              Read more →
            </a>
          </article>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="faq">
        <h2>Frequently asked questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Do you deliver on weekends?</h4>
            <p>Yes! QuickMeds delivers 7 days a week. Check delivery times in your area at checkout.</p>
          </div>
          <div className="faq-item">
            <h4>How long does delivery take?</h4>
            <p>Most orders are delivered within 24 hours. Express delivery available in select areas.</p>
          </div>
          <div className="faq-item">
            <h4>Do I need a prescription?</h4>
            <p>For certain medicines, yes. You can upload your prescription during checkout.</p>
          </div>
          <div className="faq-item">
            <h4>What if I have an issue with my order?</h4>
            <p>Our 24/7 support team is always available to help. Chat with us anytime!</p>
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER SECTION ========== */}
      <section className="newsletter">
        <h2>Stay updated with health tips</h2>
        <p>Get wellness tips and updates delivered to your inbox</p>
        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleNewsletterSubmit()}
          />
          <button onClick={handleNewsletterSubmit}>Subscribe</button>
        </div>
        {submitted && <p className="success-message">✓ Thanks for subscribing!</p>}
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cta-final">
        <h2>Ready to get your medicines delivered?</h2>
        <p>Join thousands of happy customers using QuickMeds</p>
        <button className="cta-button primary large" onClick={onGetStarted}>
          Start Your Journey Now →
        </button>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>QuickMeds</h4>
            <p>Making pharmacy accessible for everyone</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <p>
              <a href="#how">How it works</a> | <a href="#faq">FAQ</a> | <a href="#contact">Contact</a>
            </p>
          </div>
          <div className="footer-section">
            <h4>Get in touch</h4>
            <p>📧 hello@quickmeds.com</p>
            <p>📞 1800-QUICKMEDS (1800-7842-6333)</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 QuickMeds. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
