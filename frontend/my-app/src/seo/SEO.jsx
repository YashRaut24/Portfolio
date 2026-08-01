import { useEffect } from 'react';

function SEO({ title, description, image = '/assets/images/YashPhoto_.jpg' }) {
  useEffect(() => {
    document.title = title;
    const currentUrl = window.location.href;
    const absoluteImage = `${window.location.origin}${image}`;

    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLinkTag = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard meta
    setMetaTag('name', 'description', description);

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', absoluteImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', 'website');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', absoluteImage);

    // Canonical
    setLinkTag('canonical', currentUrl);

    // JSON-LD Structured Data
    let scriptData = document.querySelector('#json-ld-portfolio');
    if (!scriptData) {
      scriptData = document.createElement('script');
      scriptData.id = 'json-ld-portfolio';
      scriptData.type = 'application/ld+json';
      document.head.appendChild(scriptData);
    }
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Yash Raut",
      "jobTitle": "Full-Stack Developer & Aspiring AIML Engineer",
      "url": window.location.origin,
      "image": absoluteImage,
      "sameAs": [
        "https://linkedin.com/in/yash-raut-240505-yr30",
        "https://github.com/YashRaut24"
      ]
    };
    scriptData.textContent = JSON.stringify(jsonLd);

  }, [title, description, image]);

  return null;
}

export default SEO;