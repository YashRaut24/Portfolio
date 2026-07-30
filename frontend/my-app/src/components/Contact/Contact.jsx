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
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="contact-section">
      <ContactForm />

      {/* Single container holding all 4 elements in a row */}
      <div className="contact-links-row">
        
        {/* Email - Always Open */}
        <button
          className="static-pill"
          onClick={() => copy("yashdr2405@gmail.com", "email")}
          aria-label="Copy Email"
        >
          <div className="pill-icon">
            {copied === "email" ? <Check size={18} color="#10b981" /> : <Mail size={18} />}
          </div>
          <span className="pill-text-open">
            {copied === "email" ? "Email Copied!" : "yashdr2405@example.com"}
          </span>
        </button>

        {/* Phone - Always Open */}
        <button
          className="static-pill"
          onClick={() => copy("+91 93245 70265", "phone")}
          aria-label="Copy Phone"
        >
          <div className="pill-icon">
            {copied === "phone" ? <Check size={18} color="#10b981" /> : <Phone size={18} />}
          </div>
          <span className="pill-text-open">
            {copied === "phone" ? "Number Copied!" : "+91 93245 70265"}
          </span>
        </button>

        {/* GitHub - Expandable (Sits to the right) */}
        <a 
          href="https://github.com/YashRaut24" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="expandable-pill"
        >
          <div className="pill-icon">
            <FaGithub size={18} />
          </div>
          <span className="pill-text">GitHub <span className="arrow">→</span></span>
        </a>

        {/* LinkedIn - Expandable (Sits to the right) */}
        <a 
          href="https://www.linkedin.com/in/yash-raut-240505-yr30/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="expandable-pill"
        >
          <div className="pill-icon">
            <FaLinkedin size={18} />
          </div>
          <span className="pill-text">LinkedIn <span className="arrow">→</span></span>
        </a>

      </div>
    </div>
  );
}

export default Contact;