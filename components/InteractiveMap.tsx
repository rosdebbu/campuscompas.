import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// --- ICONS ---

// Main control icons
const ARIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const LocateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const NavArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const CameraOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>;
const MapPlaceholderIcon = () => <svg className="h-20 w-20 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

// Category-specific icons for markers
// FIX: Updated icon components to properly accept and handle `className` prop to resolve TypeScript error.
const LandmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const TransportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const FoodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" /></svg>;
const ShopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const GymIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const HealthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const HousingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className={props.className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;

// --- Local types and data ---
interface MapLocation {
  id: string;
  name: string;
  category: 'landmarks' | 'food' | 'transport' | 'shops' | 'gym' | 'health' | 'housing';
  description: string;
  coords: { lat: number; lon: number };
}

const locations: MapLocation[] = [
    { id: 'loc14', name: 'University Building', category: 'landmarks', description: 'Main administrative offices.', coords: { lat: 12.8235, lon: 80.0453 } },
    { id: 'loc15', name: 'Tech Park', category: 'landmarks', description: 'Hub for engineering and labs.', coords: { lat: 12.8249, lon: 80.0468 } },
    { id: 'loc16', name: 'T.P. Ganesan Auditorium', category: 'landmarks', description: 'Largest auditorium for events.', coords: { lat: 12.8225, lon: 80.0441 } },
    { id: 'loc17', name: 'Central Library', category: 'landmarks', description: 'Vast resources and study spaces.', coords: { lat: 12.8240, lon: 80.0435 } },
    { id: 'loc1', name: 'University Food Court (UFC)', category: 'food', description: 'Multi-cuisine food court.', coords: { lat: 12.8245, lon: 80.0472 } },
    { id: 'loc2', name: 'Java Canteen', category: 'food', description: 'Coffee, snacks, and quick bites.', coords: { lat: 12.8239, lon: 80.0465 } },
    { id: 'loc3', name: 'Nalapakam Mess', category: 'food', description: 'Primary dining hall for students.', coords: { lat: 12.8258, lon: 80.0438 } },
    { id: 'loc4', name: 'SRM University Bus Bay', category: 'transport', description: 'Main terminal for buses.', coords: { lat: 12.8248, lon: 80.0451 } },
    { id: 'loc5', name: 'Potheri Railway Station Gate', category: 'transport', description: 'Campus exit to train station.', coords: { lat: 12.8210, lon: 80.0410 } },
    { id: 'loc6', name: 'Higginbothams Bookstore', category: 'shops', description: 'Textbooks and stationery.', coords: { lat: 12.8241, lon: 80.0432 } },
    { id: 'loc7', name: 'Campus Convenience Store', category: 'shops', description: 'General store for necessities.', coords: { lat: 12.8225, lon: 80.0428 } },
    { id: 'loc8', name: 'SRM Fitness Center', category: 'gym', description: 'Gym and indoor fitness facilities.', coords: { lat: 12.8218, lon: 80.0445 } },
    { id: 'loc9', name: 'Main Sports Ground', category: 'gym', description: 'Outdoor cricket, football ground.', coords: { lat: 12.8260, lon: 80.0475 } },
    { id: 'loc10', name: 'SRM General Hospital', category: 'health', description: 'Multi-specialty hospital with 24/7 care.', coords: { lat: 12.8205, lon: 80.0455 } },
    { id: 'loc11', name: 'Apollo Pharmacy', category: 'health', description: 'Pharmacy in the hospital complex.', coords: { lat: 12.8208, lon: 80.0457 } },
    { id: 'loc12', name: "Nelson Mandela Hostel", category: 'housing', description: 'Residential block for male students.', coords: { lat: 12.8265, lon: 80.0440 } },
    { id: 'loc13', name: "Annai Teresa Hostel", category: 'housing', description: 'Residential block for female students.', coords: { lat: 12.8215, lon: 80.0480 } },
];

const mapFilters = [
    { id: 'landmarks', label: 'Key Landmarks', icon: LandmarkIcon, color: 'text-red-500' },
    { id: 'transport', label: 'Transportation', icon: TransportIcon, color: 'text-blue-500' },
    { id: 'food', label: 'Food & Dining', icon: FoodIcon, color: 'text-orange-500' },
    { id: 'shops', label: 'Shops & Services', icon: ShopIcon, color: 'text-green-500' },
    { id: 'gym', label: 'Gyms & Fitness', icon: GymIcon, color: 'text-purple-500' },
    { id: 'health', label: 'Health & Safety', icon: HealthIcon, color: 'text-rose-500 dark:text-rose-400' },
    { id: 'housing', label: 'Housing', icon: HousingIcon, color: 'text-yellow-500' },
];

// --- Sub-components ---

const ARNavigationView: React.FC<{ destination: string; onExit: () => void }> = ({ destination, onExit }) => {
    return (
        <div className="fixed inset-0 bg-black z-50 text-white flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
                <CameraOffIcon />
                <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">Camera feed placeholder</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">AR feature is a demo and requires camera access.</p>
            </div>
            <div className="relative z-10 w-full h-full flex flex-col p-4">
                <header className="flex justify-between items-center bg-black/50 p-3 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-300">Navigating to</p>
                        <h2 className="text-xl font-bold">{destination}</h2>
                    </div>
                    <button onClick={onExit} className="bg-red-500/80 hover:bg-red-600 rounded-full p-2 transition-colors" aria-label="Exit AR Navigation">
                        <CloseIcon />
                    </button>
                </header>
                <main className="flex-grow flex flex-col items-center justify-center">
                    <NavArrowIcon />
                    <p className="text-5xl font-bold mt-4 drop-shadow-md">250m</p>
                    <p className="text-xl text-gray-200 drop-shadow-md">Straight Ahead</p>
                </main>
                <footer className="text-center bg-black/50 p-3 rounded-lg">
                    <p>Follow the path to reach your destination.</p>
                </footer>
            </div>
        </div>
    );
};

// --- Main Component ---

const InteractiveMap: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<MapLocation['category']>('landmarks');
    const [arModeActive, setArModeActive] = useState(false);
    const [mapUrl, setMapUrl] = useState(`https://maps.google.com/maps?q=12.8232,80.0444&z=17&output=embed&t=m`);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMapLoading, setIsMapLoading] = useState(false);

    const visibleLocations = useMemo(() => {
        return locations.filter(loc => loc.category === activeFilter);
    }, [activeFilter]);
    
    const searchedLocations = useMemo(() => {
        if (!searchTerm) return visibleLocations;
        return visibleLocations.filter(loc => 
            loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, visibleLocations]);


    const handleSelectLocation = (location: MapLocation) => {
        setIsMapLoading(true);
        setSelectedLocation(location);
        setMapUrl(`https://maps.google.com/maps?q=${location.coords.lat},${location.coords.lon}&z=18&output=embed&t=m`);
    };

    const handleArNavigate = (destinationName: string) => {
        setSelectedLocation(locations.find(l => l.name === destinationName) || null);
        setArModeActive(true);
    };

    const handleFilterChange = (filterId: MapLocation['category']) => {
        setActiveFilter(filterId);
        setSelectedLocation(null);
        setSearchTerm('');
        // Reset map to overview
        setMapUrl(`https://maps.google.com/maps?q=12.8232,80.0444&z=17&output=embed&t=m`);
    };

    return (
        <section id="transport" className="py-12 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {arModeActive && selectedLocation && (
                <ARNavigationView
                    destination={selectedLocation.name}
                    onExit={() => setArModeActive(false)}
                />
            )}

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 max-w-7xl"
            >
                <div className="text-center mb-10 md:mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-semibold mb-4 tracking-wide border border-blue-200 dark:border-blue-800">
                        Campus Navigation
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 dark:from-white dark:to-slate-300 mb-4 md:mb-6 font-space">
                        Interactive Campus Map
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore points of interest and find your way around SRMIST using our interactive directory and live map.
                    </p>
                </div>

                {/* Filter Toggles */}
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                    {mapFilters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => handleFilterChange(filter.id as MapLocation['category'])}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2 border shadow-sm ${
                                activeFilter === filter.id 
                                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500 shadow-blue-500/30' 
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
                            }`}
                        >
                          <filter.icon className={`h-5 w-5 ${activeFilter === filter.id ? 'text-white' : filter.color}`} />  {filter.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left: Map */}
                    <div className="lg:w-[60%] xl:w-2/3 w-full h-[400px] lg:h-[650px] rounded-3xl shadow-xl overflow-hidden relative bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        {isMapLoading && (
                            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center transition-opacity" role="status">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <span className="mt-4 text-blue-800 dark:text-blue-200 font-medium">Loading map...</span>
                            </div>
                        )}
                        <iframe
                            key={mapUrl}
                            width="100%"
                            height="100%"
                            className="w-full h-full border-0 absolute inset-0 z-10"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={mapUrl}
                            title="Interactive Campus Map"
                            onLoad={() => setIsMapLoading(false)}
                        ></iframe>
                    </div>
                    
                    {/* Right: Sidebar */}
                    <div className="lg:w-[40%] xl:w-1/3 w-full h-[400px] lg:h-[650px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 capitalize flex items-center">
                                <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                                {activeFilter} Locations
                            </h3>
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Search specific locations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-3.5 pl-12 pr-4 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {searchedLocations.length > 0 ? searchedLocations.map(location => {
                                const categoryInfo = mapFilters.find(f => f.id === location.category);
                                const Icon = categoryInfo?.icon || LandmarkIcon;
                                const isActive = selectedLocation?.id === location.id;
                                
                                return (
                                <div 
                                    key={location.id} 
                                    onClick={() => handleSelectLocation(location)}
                                    className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer border-2 bg-white dark:bg-slate-900 group ${
                                        isActive 
                                        ? 'border-blue-500 dark:border-blue-400 shadow-md ring-4 ring-blue-500/10 dark:ring-blue-400/10' 
                                        : 'border-slate-100 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                            isActive 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                                        } text-slate-600 dark:text-slate-400 transition-colors`}>
                                            <Icon className={`h-6 w-6 ${isActive ? 'text-white' : categoryInfo?.color}`} />
                                        </div>
                                        <div className="flex-1 mt-0.5">
                                            <h4 className={`font-bold transition-colors ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                                {location.name}
                                            </h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{location.description}</p>
                                        </div>
                                    </div>
                                    
                                    {isActive && (
                                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                                        <button 
                                            onClick={(e) => {e.stopPropagation(); handleSelectLocation(location)}} 
                                            className="flex-1 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 dark:hover:bg-blue-500/30 font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center transition-colors border border-blue-200 dark:border-blue-500/30"
                                        >
                                            <LocateIcon /> Pin Selected
                                        </button>
                                        <button 
                                            onClick={(e) => {e.stopPropagation(); handleArNavigate(location.name)}} 
                                            className="flex-1 text-sm bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center transition-colors border border-transparent shadow-sm"
                                        >
                                            <ARIcon /> Try AR View
                                        </button>
                                    </div>
                                    )}
                                </div>
                            )}) : (
                                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No results found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">We couldn't find any location matching your search. Try different keywords.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.3);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(75, 85, 99, 0.5);
                }
            `}</style>
        </section>
    );
};

export default InteractiveMap;