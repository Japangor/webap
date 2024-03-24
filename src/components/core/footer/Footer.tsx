import { Section } from "@/components/core/section/Section";
import { Link } from "@/lib/intl/navigation";
import { InstagramIcon, LinkedinIcon, XIcon } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Section size="sm">
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <a href="/" title="Home">
            <img src="/logo3.png" alt="Logo" width={200} height={100} />
            </a>
          </div>
          {/* Menu Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left md:col-span-2">
            <div>
              <p className="font-bold text-gray-300 mb-2">About</p>
              <Link href="/features" title="Features" className="text-indigo-300 hover:text-white block mb-2">Features</Link>
              <Link href="/pricing" title="Pricing" className="text-indigo-300 hover:text-white block mb-2">Pricing</Link>
            </div>
            <div>
              <p className="font-bold text-gray-300 mb-2">Company</p>
              <Link href="/about-us" title="About us" className="text-indigo-300 hover:text-white block mb-2">About us</Link>
              <Link href="/blog" title="Blog" className="text-indigo-300 hover:text-white block mb-2">Blog</Link>
              <Link href="/careers" title="Careers" className="text-indigo-300 hover:text-white block mb-2">Careers</Link>
            </div>
          </div>
          {/* Social links */}
          <div className="flex flex-col items-center md:items-start md:col-span-1 md:text-center">
            <p className="text-gray-300 mb-2">Follow us:</p>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://www.linkedin.com/company/japangor/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="text-indigo-300 hover:text-white"
              >
                <LinkedinIcon />
              </a>
              <a
                href="https://twitter.com/japangor"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                className="text-indigo-300 hover:text-white"
              >
                <XIcon />
              </a>
              <a
                href="https://instagram.com/japangor.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="text-indigo-300 hover:text-white"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
        {/* Copyright */}
  
      </footer>
    </Section>
  );
}
