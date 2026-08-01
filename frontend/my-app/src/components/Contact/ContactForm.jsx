import { useState } from 'react';
import { sendContactMessage } from '../../services/api';
import './ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });
  const [startTime, setStartTime] = useState(Date.now());

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status to loading state
    setStatus({ loading: true, error: null, success: false });

    // Calculate how long it took to fill out the form
    const timeToComplete = Date.now() - startTime;
    const payload = { ...formData, timeToComplete };

    try {
      await sendContactMessage(payload);
      
      // On success: clear the form and show success message
      setStatus({ loading: false, error: null, success: true });
      setFormData({ name: '', email: '', message: '', website: '' }); 
      setStartTime(Date.now()); // Reset the timer for the next potential submission
      
      // Optional: Hide success message after 5 seconds
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
      
    } catch (error) {
      // On fail: show the error message from the backend
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* Invisible Honeypot Field for Bot Detection */}
      <div className="form-group" style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input 
          type="text" 
          id="website" 
          name="website" 
          value={formData.website} 
          onChange={handleChange} 
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea 
          id="message" 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          required 
        ></textarea>
      </div>

      <button type="submit" disabled={status.loading}>
        {status.loading ? 'Sending...' : 'Send Message'}
      </button>

      {/* Feedback Messages */}
      {status.success && <p className="success-message">Message sent successfully! I'll be in touch soon.</p>}
      {status.error && <p className="error-message">Error: {status.error}</p>}
    </form>
  );
}

export default ContactForm;