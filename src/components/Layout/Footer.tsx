import React, { useState } from 'react';
import { ArrowUp, MapPin, Phone, Mail, BookOpen, X } from 'lucide-react';

export default function Footer() {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalContent, setLegalContent] = useState({ title: '', content: '' });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLegalClick = (type: string) => {
    let title = '';
    let content = '';

    switch (type) {
      case 'privacy':
        title = 'Privacy Policy';
        content = `
          <h3>Privacy Policy for StudyMates</h3>
          <p><strong>Effective Date:</strong> January 1, 2024</p>
          
          <h4>1. Information We Collect</h4>
          <p>We collect information you provide directly to us, such as when you create an account, upload study materials, or communicate with other users.</p>
          
          <h4>2. How We Use Your Information</h4>
          <p>We use the information we collect to provide, maintain, and improve our services, including facilitating study sessions and connecting students.</p>
          
          <h4>3. Information Sharing</h4>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
          
          <h4>4. Data Security</h4>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h4>5. Contact Us</h4>
          <p>If you have any questions about this Privacy Policy, please contact us at shivamdivakar3009@gmail.com</p>
        `;
        break;
      case 'terms':
        title = 'Terms & Conditions';
        content = `
          <h3>Terms & Conditions for StudyMates</h3>
          <p><strong>Effective Date:</strong> January 1, 2024</p>
          
          <h4>1. Acceptance of Terms</h4>
          <p>By accessing and using StudyMates, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h4>2. Use License</h4>
          <p>Permission is granted to temporarily use StudyMates for personal, non-commercial educational purposes only.</p>
          
          <h4>3. User Content</h4>
          <p>Users are responsible for the content they upload and share. Content must be educational and appropriate for an academic environment.</p>
          
          <h4>4. Prohibited Uses</h4>
          <p>You may not use StudyMates for any unlawful purpose or to solicit others to perform unlawful acts.</p>
          
          <h4>5. Termination</h4>
          <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.</p>
          
          <h4>6. Contact Information</h4>
          <p>Questions about the Terms should be sent to us at shivamdivakar3009@gmail.com</p>
        `;
        break;
      case 'cookies':
        title = 'Cookie Policy';
        content = `
          <h3>Cookie Policy for StudyMates</h3>
          <p><strong>Effective Date:</strong> January 1, 2024</p>
          
          <h4>1. What Are Cookies</h4>
          <p>Cookies are small text files that are stored on your computer or mobile device when you visit our website.</p>
          
          <h4>2. How We Use Cookies</h4>
          <p>We use cookies to enhance your experience, remember your preferences, and analyze how our service is used.</p>
          
          <h4>3. Types of Cookies We Use</h4>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
          
          <h4>4. Managing Cookies</h4>
          <p>You can control and/or delete cookies as you wish through your browser settings. However, removing cookies may affect the functionality of our service.</p>
          
          <h4>5. Contact Us</h4>
          <p>If you have any questions about our use of cookies, please contact us at shivamdivakar3009@gmail.com</p>
        `;
        break;
      case 'copyright':
        title = 'Copyright Policy';
        content = `
          <h3>Copyright Policy for StudyMates</h3>
          <p><strong>Effective Date:</strong> January 1, 2024</p>
          
          <h4>1. Respect for Copyright</h4>
          <p>StudyMates respects the intellectual property rights of others and expects users to do the same.</p>
          
          <h4>2. User Content</h4>
          <p>By uploading content to StudyMates, you represent that you own or have the necessary rights to share such content.</p>
          
          <h4>3. Copyright Infringement</h4>
          <p>If you believe that content on StudyMates infringes your copyright, please contact us immediately with details of the alleged infringement.</p>
          
          <h4>4. DMCA Compliance</h4>
          <p>We comply with the Digital Millennium Copyright Act (DMCA) and will respond to valid takedown notices.</p>
          
          <h4>5. Repeat Infringers</h4>
          <p>We reserve the right to terminate accounts of users who repeatedly infringe copyrights.</p>
          
          <h4>6. Contact for Copyright Issues</h4>
          <p>Report copyright infringement to: shivamdivakar3009@gmail.com</p>
        `;
        break;
      default:
        return;
    }

    setLegalContent({ title, content });
    setShowLegalModal(true);
  };

  return (
    <>
      <footer className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StudyMates
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                Your Growth, Our Community. The ultimate learning platform for students to collaborate, share knowledge, and achieve academic excellence together.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
               
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Youtube Link</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Github Repository</a></li>
                <li><a href="https://bolt.new/~/sb1-3ccy6qro" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Bolt Project URL</a></li>
                 <li><a href="https://supabase.com/dashboard/project/dtbmhwgpzokkmhfawpdr/editor/23906?schema=public" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Supabase Link</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleLegalClick('privacy')}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLegalClick('terms')}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLegalClick('cookies')}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm text-left"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLegalClick('copyright')}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm text-left"
                  >
                    Copyright
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-sm">
                    B/702 Star Premier 1,<br />
                    Indralok Phase 5,<br />
                    Mira-Bhayandar, <br />
                    Thane-401105, India
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <a href="tel:1234567890" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    +91 1234567890
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:srd@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    shivamdivakar3009@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 StudyMates. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors text-sm"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Content Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">{legalContent.title}</h3>
              <button
                onClick={() => setShowLegalModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div 
              className="text-gray-300 text-sm sm:text-base prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: legalContent.content }}
            />
            
            <button
              onClick={() => setShowLegalModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Bolt.new Badge */}
      <a 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-4 right-4 z-50 hover:opacity-90 transition-opacity"
      >
        <img 
          src="/badgeBolt.png" 
          alt="Powered by Bolt.new" 
          className="h-12 w-auto"
        />
      </a>
    </>
  );
}