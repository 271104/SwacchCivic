import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, MapPin, FileText, ArrowLeft, Camera, Sparkles, Navigation, X, RotateCw } from 'lucide-react';
import { complaintsAPI } from '../../services/api';
import { complaintTypes } from '../../utils/helpers';
import toast from 'react-hot-toast';
import SMCHeader from '../../components/common/SMCHeader';
import SMCFooter from '../../components/common/SMCFooter';

export default function RegisterComplaint() {
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        location: '',
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);
    const [geoLocation, setGeoLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    // Auto-detect location and open camera on component mount
    useEffect(() => {
        detectLocation();
        // Auto-open camera after a short delay to allow location detection
        const timer = setTimeout(() => {
            startCamera();
        }, 1000);
        
        // Cleanup camera stream on unmount
        return () => {
            clearTimeout(timer);
            stopCamera();
        };
    }, []);

    // Ensure video plays when stream is available
    useEffect(() => {
        if (videoRef.current && streamRef.current && cameraActive) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(err => {
                console.log('Video play error:', err);
            });
        }
    }, [cameraActive]);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setGeoLocation({ latitude, longitude });
                
                // Try to get readable address using reverse geocoding
                try {
                    const address = await reverseGeocode(latitude, longitude);
                    setFormData(prev => ({ ...prev, location: address }));
                    toast.success('Location detected automatically!');
                } catch (error) {
                    console.error('Reverse geocoding failed:', error);
                    setFormData(prev => ({ 
                        ...prev, 
                        location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
                    }));
                }
                setLoadingLocation(false);
            },
            (error) => {
                console.log('Geolocation error:', error.code, error.message);
                setLoadingLocation(false);
                
                // Don't show error toast on initial load, only when user clicks button
                if (error.code === error.PERMISSION_DENIED) {
                    // Silent fail on page load, user can click button to try again
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    console.log('Location unavailable');
                } else if (error.code === error.TIMEOUT) {
                    console.log('Location request timed out');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const reverseGeocode = async (latitude, longitude) => {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data && data.display_name) {
            return data.display_name;
        }
        throw new Error('Unable to get address');
    };

    const startCamera = async () => {
        try {
            // Request location first
            if (!geoLocation) {
                setLoadingLocation(true);
                await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            setGeoLocation({ latitude, longitude });
                            
                            try {
                                const address = await reverseGeocode(latitude, longitude);
                                setFormData(prev => ({ ...prev, location: address }));
                            } catch (error) {
                                setFormData(prev => ({ 
                                    ...prev, 
                                    location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
                                }));
                            }
                            setLoadingLocation(false);
                            resolve();
                        },
                        (error) => {
                            setLoadingLocation(false);
                            toast.error('Location access required for geotagged photos');
                            reject(error);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        }
                    );
                });
            }

            // Start camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            
            streamRef.current = stream;
            
            // Wait for video element to be ready
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                // Ensure video plays
                try {
                    await videoRef.current.play();
                } catch (playError) {
                    console.log('Video play error (can be ignored):', playError);
                }
            }
            
            setCameraActive(true);
            console.log('✅ Camera started successfully');
        } catch (error) {
            console.error('Camera error:', error);
            if (error.name === 'NotAllowedError') {
                toast.error('Camera permission denied. Please allow camera access.');
            } else if (error.name === 'NotFoundError') {
                toast.error('No camera found on this device.');
            } else {
                toast.error('Failed to start camera: ' + error.message);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    const switchCamera = async () => {
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
        setTimeout(() => startCamera(), 100);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !geoLocation) {
            toast.error('Location not available. Please wait...');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        // Convert to blob with geolocation metadata
        canvas.toBlob((blob) => {
            const timestamp = new Date().toISOString();
            const fileName = `geotagged-${Date.now()}.jpg`;
            
            // Create file with metadata
            const file = new File([blob], fileName, { 
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            // Store geolocation separately (EXIF embedding would require additional library)
            file.geoLocation = {
                latitude: geoLocation.latitude,
                longitude: geoLocation.longitude,
                timestamp: timestamp,
                address: formData.location
            };

            setPhoto(file);
            setPreview(canvas.toDataURL('image/jpeg'));
            stopCamera();
            toast.success('Photo captured with location data!');
        }, 'image/jpeg', 0.95);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!photo) {
            toast.error('Please capture a photo | कृपया फोटो घ्या');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('description', formData.description);
        data.append('location', formData.location);
        data.append('photo', photo);
        
        // Add geo-coordinates if available
        if (geoLocation) {
            data.append('latitude', geoLocation.latitude);
            data.append('longitude', geoLocation.longitude);
            data.append('autoDetectedLocation', formData.location);
        }

        try {
            const response = await complaintsAPI.create(data);
            const insights = response.data.aiInsights;

            if (insights) {
                setAiInsights(insights);
                toast.success('Complaint registered successfully! | तक्रार यशस्वीरित्या नोंदवली!', { duration: 4000 });
            } else {
                toast.success('Complaint registered successfully! | तक्रार यशस्वीरित्या नोंदवली!');
                navigate('/my-complaints');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register complaint | तक्रार नोंदवण्यात अयशस्वी');
        } finally {
            setLoading(false);
        }
    };

    if (aiInsights) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="max-w-2xl mx-auto pt-8">
                    <div className="bg-white rounded-2xl shadow-soft p-8 animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Sparkles className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Complaint Registered Successfully!
                            </h2>
                            <p className="text-gray-600">AI Analysis Complete</p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-sm text-indigo-700 font-medium mb-1">Detected Complaint Type</p>
                                <p className="text-2xl font-bold text-indigo-900">{aiInsights.detectedType}</p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700 font-medium mb-1">Severity</p>
                                <p className="text-2xl font-bold text-blue-900">{aiInsights.severity}</p>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-700 font-medium mb-1">Priority Level</p>
                                <p className="text-xl font-bold text-purple-900 uppercase">{aiInsights.priority}</p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700 font-medium mb-1">Estimated Resolution</p>
                                <p className="text-xl font-bold text-green-900">{aiInsights.estimatedResolution}</p>
                            </div>

                            {aiInsights.description && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-700 font-medium mb-1">AI Description</p>
                                    <p className="text-gray-900">{aiInsights.description}</p>
                                </div>
                            )}

                            {aiInsights.detectedIssues && aiInsights.detectedIssues.length > 0 && (
                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <p className="text-sm text-orange-700 font-medium mb-2">Detected Issues</p>
                                    <div className="flex flex-wrap gap-2">
                                        {aiInsights.detectedIssues.map((issue, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                                {issue.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/my-complaints')}
                            className="btn btn-primary w-full"
                        >
                            View My Complaints
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Camera View - Full Screen */}
            {cameraActive && !preview && (
                <div className="relative w-full h-screen">
                    {/* Camera Feed */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Location Overlay */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
                        <div className="flex items-start gap-2 text-white text-sm">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium">{formData.location || 'Detecting location...'}</p>
                                {geoLocation && (
                                    <p className="text-xs text-gray-300 mt-1">
                                        GPS: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)}
                                    </p>
                                )}
                                <p className="text-xs text-gray-300 mt-1">
                                    {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Camera Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <div className="flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="p-3 bg-red-500 hover:bg-red-600 rounded-full text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <button
                                type="button"
                                onClick={capturePhoto}
                                disabled={!geoLocation}
                                className="p-5 bg-white hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Camera className="w-8 h-8 text-gray-900" />
                            </button>

                            <button
                                type="button"
                                onClick={switchCamera}
                                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
                            >
                                <RotateCw className="w-6 h-6" />
                            </button>
                        </div>
                        {!geoLocation && (
                            <p className="text-center text-white text-sm mt-2">
                                Waiting for GPS location...
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Photo Preview & Submit */}
            {preview && (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <div className="max-w-2xl mx-auto pt-8">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>

                        <div className="bg-white rounded-2xl shadow-soft p-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm & Submit</h1>
                            <p className="text-gray-600 text-sm mb-6">AI will analyze your photo and detect the complaint type automatically</p>

                            {/* Captured Photo */}
                            <div className="mb-6">
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Captured"
                                        className="w-full rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhoto(null);
                                            setPreview(null);
                                            startCamera();
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {geoLocation && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-medium text-green-900">Geotagged Photo</p>
                                                <p className="text-green-700 text-xs mt-1">{formData.location}</p>
                                                <p className="text-green-600 text-xs mt-1">
                                                    {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description - Optional */}
                            <div className="mb-6">
                                <label className="label">Description (Optional)</label>
                                <textarea
                                    className="input min-h-[80px]"
                                    placeholder="Add any additional details to help AI analyze better (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Tip: Mention severity (e.g., "heavy garbage", "large pothole") for better AI analysis
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>AI is analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Submit Complaint
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {!cameraActive && !preview && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                        <p className="text-lg">Opening Camera...</p>
                        <p className="text-sm text-gray-400 mt-2">Please allow camera and location permissions</p>
                    </div>
                </div>
            )}
        </div>
    );
}
