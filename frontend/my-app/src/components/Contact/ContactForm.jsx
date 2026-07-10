import { useState } from 'react';
import { submitContactForm } from '../../services/api';
import './ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMsg(error.message);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="form-input"
        required
      />

      <label className="form-label" htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="form-input"
        required
      />

      <label className="form-label" htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="form-textarea"
        rows="5"
        required
      />

      <button type="submit" className="form-submit-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && <p className="form-success-msg">Message sent successfully!</p>}
      {status === 'error' && <p className="form-error-msg">{errorMsg}</p>}
    </form>
  );
}

export default ContactForm;