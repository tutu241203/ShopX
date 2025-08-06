import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;
      setShowBackToTop(atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-800 text-white py-4 relative">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:text-left">
            <p className="text-sm">© 2025 ShopX. All rights reserved.</p>
          </div>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="w-5 h-5 text-white hover:text-gray-300 transition-colors duration-300"
                aria-label="Instagram"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter
                className="w-5 h-5 text-white hover:text-gray-300 transition-colors duration-300"
                aria-label="Twitter"
              />
            </a>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="/about" className="text-xs hover:underline">
              About
            </a>
            <a href="/contact" className="text-xs hover:underline">
              Contact
            </a>
          </div>
        </div>
      </div>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gray-700 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center space-x-1"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="text-xs">Back to Top</span>
        </button>
      )}
    </footer>
  );
};

export default Footer;
