import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-white py-12 border-t" style={{ backgroundColor: '#2B0E3F', borderColor: 'rgba(229, 199, 255, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
                <span className="text-white font-serif text-xl">M</span>
              </div>
              <h4 className="text-lg font-serif font-bold">Muspy Ho's</h4>
            </div>
            <p className="text-sm" style={{ color: '#E5C7FF' }}>
              Premium booking made simple, safe, and exclusive
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#E5C7FF' }}>
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#E5C7FF' }}>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/safety-guidelines" className="hover:text-white transition-colors">Safety Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#E5C7FF' }}>
              <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="mailto:support@muspyhos.com" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-sm" style={{ color: '#E5C7FF' }}>&copy; 2026 Muspy Ho's. All rights reserved. Crafted with excellence.</p>
        </div>
      </div>
    </footer>
  );
}