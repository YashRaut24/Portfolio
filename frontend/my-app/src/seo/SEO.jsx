import { useEffect } from 'react';

function SEO({ title, description, image = '/assets/images/YashPhoto_.jpg' }) {
  useEffect(() => {
    // Derive dynamic identity based on the current pathname or passed title
    const path = window.location.pathname;
    let enhancedTitle = title;
    let themeColor = '#121212';
    let faviconHref = '/favicon.svg';

    if (path === '/' || title.includes('Yash | Portfolio')) {
      enhancedTitle = 'Yash Raut • Portfolio';
      themeColor = '#FAFAFA'; // Warm notebook background (--book-bg)
      faviconHref = '/favicon-book.svg';
    } else if (path.includes('/explore') || title.includes('Explore')) {
      enhancedTitle = 'Explore • Yash Raut';
      themeColor = '#0A0B10'; // Deep space background color (--color-bg)
      faviconHref = '/favicon-explore.svg';
    } else {
      enhancedTitle = '404 • Yash Raut';
      themeColor = '#121212'; // Neutral dark
      faviconHref = '/favicon.svg';
    }

    document.title = enhancedTitle;

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

    // Update Browser Chrome & Theme Colors
    setMetaTag('name', 'theme-color', themeColor);
    
    // Update Dynamic Favicon
    setLinkTag('icon', faviconHref);
    setLinkTag('apple-touch-icon', faviconHref);

    // Standard meta
    setMetaTag('name', 'description', description);

    // Open Graph
    const absoluteImage = `${window.location.origin}${image}`;
    const currentUrl = window.location.href;
    
    setMetaTag('property', 'og:title', enhancedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', absoluteImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', 'website');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', enhancedTitle);
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