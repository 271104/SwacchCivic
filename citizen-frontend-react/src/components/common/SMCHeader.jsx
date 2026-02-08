import { Phone, Building2 } from 'lucide-react';

export default function SMCHeader({ title, subtitle }) {
    return (
        <div className="bg-white shadow-lg">
            {/* Top Bar with Helpline */}
            <div className="bg-blue-900 py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-yellow-300">
                        <Phone className="w-3 h-3" />
                        <span className="font-medium">Helpline: 0217-2735293, 0217-2740335</span>
                    </div>
                    <div className="hidden md:block text-blue-200">
                        Government of Maharashtra | महाराष्ट्र शासन
                    </div>
                </div>
            </div>
            
            {/* Header with Banner Background and Logo Overlay */}
            <div className="relative">
                {/* Banner as Background */}
                <div className="w-full h-32 md:h-40">
                    <img 
                        src="/SMC_banner.jpg" 
                        alt="Solapur Smart City" 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Logo Overlaying Banner - Professional Styling */}
                <div className="absolute top-2 left-4 md:left-8">
                    <div className="bg-white rounded-xl shadow-2xl p-3 md:p-4 border-2 border-blue-100">
                        <img 
                            src="/SMC_logo.jpg" 
                            alt="Solapur Municipal Corporation" 
                            className="h-16 md:h-20 w-auto object-contain"
                        />
                    </div>
                </div>
                
                {/* Title Overlaying Banner */}
                {title && (
                    <div className="absolute bottom-3 left-4 md:left-8 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 inline-block">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-8 bg-blue-600 rounded"></div>
                                <p className="text-sm md:text-lg text-blue-700 font-semibold">
                                    {title}
                                </p>
                            </div>
                            {subtitle && (
                                <p className="text-xs md:text-sm text-gray-600 mt-1 ml-10">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Tagline Bar */}
            <div className="bg-yellow-500 py-2 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-blue-900 font-bold text-sm md:text-base">
                        आपली सेवा आमचे कर्तव्य | Your Service, Our Duty
                    </p>
                </div>
            </div>
        </div>
    );
}
