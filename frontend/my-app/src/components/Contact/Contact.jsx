import { useState } from "react";
import { Copy, Check, Mail, Phone } from "lucide-react";
import ContactForm from "./ContactForm";
import "./Contact.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Contact() {
  const [copied, setCopied] = useState("");

  const copy = async (value, id) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);

    setTimeout(() => {
      setCopied("");
    }, 1500);
  };

  return (
    <div className="contact-section">
      <ContactForm />

      <div className="contact-details">

        <div className="contact-detail">
          <Mail size={18} />

          <span>you@example.com</span>

          <button
            className="copy-btn"
            onClick={() => copy("you@example.com", "email")}
          >
            {copied === "email" ? <Check size={16} /> : <Copy size={16} />}
          </button>

          {copied === "email" && (
            <span className="copy-tooltip">Copied!</span>
          )}
        </div>

        <div className="contact-detail">
          <Phone size={18} />

          <span>+91 XXXXX XXXXX</span>

          <button
            className="copy-btn"
            onClick={() => copy("+91 XXXXX XXXXX", "phone")}
          >
            {copied === "phone" ? <Check size={16} /> : <Copy size={16} />}
          </button>

          {copied === "phone" && (
            <span className="copy-tooltip">Copied!</span>
          )}
        </div>

      </div>

      <div className="contact-socials">
        <a href="#">
          <FaGithub size={18} />
          GitHub
        </a>

        <a href="#">
          <FaLinkedin size={18} />
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export default Contact;