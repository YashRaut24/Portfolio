import ContactForm from './ContactForm';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-section">
      <ContactForm />
      <div className="contact-socials">
        <a href="#" className="contact-social-link stagger-item" style={{ '--stagger-index': 0 }}>GitHub</a>
        <a href="#" className="contact-social-link stagger-item" style={{ '--stagger-index': 1 }}>LinkedIn</a>
        <a href="#" className="contact-social-link stagger-item" style={{ '--stagger-index': 2 }}>Email</a>
      </div>
    </div>
  );
}

export default Contact;