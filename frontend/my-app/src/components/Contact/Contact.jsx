import ContactForm from './ContactForm';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-section">
      <ContactForm />
      <div className="contact-socials">
        <a href="#" className="contact-social-link">GitHub</a>
        <a href="#" className="contact-social-link">LinkedIn</a>
        <a href="#" className="contact-social-link">Email</a>
      </div>
    </div>
  );
}

export default Contact;