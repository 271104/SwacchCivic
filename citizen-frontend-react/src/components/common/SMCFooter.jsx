import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function SMCFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300 border-t-4 border-yellow-500">
            {/* Main Footer Content */}
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* About SMC */}
                        <div>
                            <h3 className="text-white font-bold mb-3 text-lg border-b-2 border-yellow-500 pb-2 inline-block">
                                About SMC
                            </h3>
                            <p className="text-sm leading-relaxed mt-3">
                                Solapur Municipal Corporation is committed to providing efficient civic services 
                                and maintaining the city's infrastructure for the welfare of citizens.
                            </p>
                            <div className="mt-4">
                                <img src="/smc-logo.svg" alt="SMC" className="w-16 h-16" />
                            </div>
                        </div>
                        
                        {/* Contact Information */}
                        <div>
                            <h3 className="text-white font-bold mb-3 text-lg border-b-2 border-yellow-500 pb-2 inline-block">
                                Contact Us
                            </h3>
                            <ul className="space-y-3 mt-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                                    <span>Solapur Municipal Corporation<br/>Solapur, Maharashtra, India</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-yellow-400" />
                                    <span>0217-2735293, 0217-2740335</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-yellow-400" />
                                    <span>smcwebsite.feedback@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold mb-3 text-lg border-b-2 border-yellow-500 pb-2 inline-block">
                                Quick Links
                            </h3>
                            <ul className="space-y-2 mt-3 text-sm">
                                <li>
                                    <a href="https://www.solapurcorporation.gov.in" target="_blank" rel="noopener noreferrer" 
                                       className="hover:text-yellow-400 transition-colors flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        Official SMC Website
                                    </a>
                                </li>
                                <li>
                                    <a href="https://complaint.solapurcorporation.org" target="_blank" rel="noopener noreferrer" 
                                       className="hover:text-yellow-400 transition-colors flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        Complaint Portal
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-yellow-400 transition-colors">About Corporation</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-yellow-400 transition-colors">Services</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Office Hours */}
                        <div>
                            <h3 className="text-white font-bold mb-3 text-lg border-b-2 border-yellow-500 pb-2 inline-block">
                                Office Hours
                            </h3>
                            <div className="mt-3 text-sm space-y-2">
                                <p className="flex items-center gap-2">
                                    <span className="text-yellow-400 font-semibold">Mon - Fri:</span>
                                    <span>9:45 AM - 6:15 PM</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-yellow-400 font-semibold">Saturday:</span>
                                    <span>9:45 AM - 1:00 PM</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-yellow-400 font-semibold">Sunday:</span>
                                    <span>Closed</span>
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <p className="text-xs text-gray-400">
                                        <strong>Web Information Manager:</strong><br/>
                                        Birudev Sarvade<br/>
                                        System Support Engineer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Copyright Bar */}
            <div className="bg-gray-950 py-4 px-4 border-t border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-xs md:text-sm space-y-2">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} Solapur Municipal Corporation. All Rights Reserved.
                        </p>
                        <p className="text-gray-500">
                            Official Website of Solapur Municipal Corporation, Government of Maharashtra, India
                        </p>
                        <p className="text-gray-500">
                            Information published and managed by Solapur Municipal Corporation
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                            Best viewed in: Chrome 125+ | Firefox 126+ | Edge 125+ | Safari 17+
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
