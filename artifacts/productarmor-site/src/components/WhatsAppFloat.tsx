export default function WhatsAppFloat() {
    const phone = "917416207700";
    const message = encodeURIComponent("Hello, I'm interested in your pharmaceutical packaging products.");
    const href = `https://wa.me/${phone}?text=${message}`;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe57] text-white px-4 py-3 rounded-full shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl group"
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.475 2.025 7.784L0 32l8.43-2.208A15.934 15.934 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.76-1.839l-.484-.287-5.007 1.311 1.337-4.877-.316-.498A13.283 13.283 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.293-9.937c-.399-.2-2.362-1.166-2.729-1.299-.366-.133-.633-.2-.9.2-.266.399-1.032 1.299-1.265 1.566-.233.266-.466.3-.866.1-.399-.2-1.685-.62-3.21-1.98-1.187-1.058-1.988-2.367-2.22-2.766-.234-.4-.025-.615.175-.814.18-.18.4-.466.6-.7.2-.233.267-.4.4-.666.133-.267.067-.5-.033-.7-.1-.2-.9-2.166-1.233-2.966-.324-.78-.654-.674-.9-.686l-.766-.013c-.267 0-.7.1-1.066.5-.366.4-1.4 1.367-1.4 3.333s1.433 3.866 1.633 4.133c.2.266 2.82 4.308 6.832 6.04.955.411 1.7.657 2.28.841.958.305 1.83.262 2.52.159.769-.114 2.362-.965 2.695-1.898.333-.933.333-1.733.233-1.9-.1-.166-.366-.266-.766-.466z" />
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">WhatsApp Us</span>
      </a>
    );
  }
  