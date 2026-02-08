import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, MapPin, FileText, ArrowLeft, Camera, Sparkles, Navigation } from 'lucide-react';
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
    const navigate = useNavigate();

    // Auto-detect location on component mount
    useEffect(() => {
        detectLocation();
    }, []);

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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!photo) {
            toast.error('Please upload a photo | कृपया फोटो अपलोड करा');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('type', formData.type);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-2xl mx-auto pt-8">
                {/* Header */}
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-soft p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Register New Complaint</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Complaint Type */}
                        <div>
                            <label className="label">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Complaint Type
                            </label>
                            <select
                                className="input"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            >
                                <option value="">-- Select Type --</option>
                                {complaintTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="label">Description</label>
                            <textarea
                                className="input min-h-[100px]"
                                placeholder="Describe the issue (optional - AI will analyze the image)"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="label mb-0">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Location
                                </label>
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    disabled={loadingLocation}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                >
                                    <Navigation className="w-4 h-4" />
                                    {loadingLocation ? 'Detecting...' : 'Detect Location'}
                                </button>
                            </div>
                            <input
                                type="text"
                                className="input"
                                placeholder={loadingLocation ? "Detecting your location..." : "Enter location or use auto-detect"}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            {geoLocation && (
                                <p className="text-xs text-green-600 mt-1">
                                    ✓ GPS coordinates captured: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)}
                                </p>
                            )}
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="label">
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="input"
                                required
                            />
                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full max-w-md rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Analyzing with AI...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Submit Complaint
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
