import React, { useState, useEffect } from 'react';
import type { Place } from '../types';

// --- MOCK DATA ---
const initialPlaces: Record<string, Place[]> = {
  transport: [
    { id: 't1', name: 'Main Campus Bus Stop', address: 'Near Admin Block', rating: 4.5, imageUrl: 'https://picsum.photos/seed/transport1/400/300', reviewCount: 88 },
    { id: 't2', name: 'Potheri Railway Station Gate', address: 'East Campus Exit', rating: 4.2, imageUrl: 'https://picsum.photos/seed/transport2/400/300', reviewCount: 102 },
  ],
  food: [
    { id: 'f1', name: 'Java Cafe', address: 'Tech Park, Ground Floor', rating: 4.8, imageUrl: 'https://picsum.photos/seed/food1/400/300', reviewCount: 213 },
    { id: 'f2', name: 'Main Mess Hall', address: 'Central Campus', rating: 3.9, imageUrl: 'https://picsum.photos/seed/food2/400/300', reviewCount: 540 },
    { id: 'f3', name: 'Foodys Express', address: 'Near Sports Complex', rating: 4.4, imageUrl: 'https://picsum.photos/seed/food3/400/300', reviewCount: 156 },
  ],
  shops: [
    { id: 's1', name: 'University Bookstore', address: 'Opposite Library', rating: 4.6, imageUrl: 'https://picsum.photos/seed/shops1/400/300', reviewCount: 95 },
    { id: 's2', name: 'Campus Convenience Store', address: 'Near Hostels', rating: 4.3, imageUrl: 'https://picsum.photos/seed/shops2/400/300', reviewCount: 110 },
  ],
  health: [
    { id: 'h1', name: 'SRM General Hospital', address: 'Main Campus Entrance', rating: 4.7, imageUrl: 'https://picsum.photos/seed/health1/400/300', reviewCount: 305 },
    { id: 'h2', name: 'Campus Pharmacy', address: 'Inside Hospital Complex', rating: 4.5, imageUrl: 'https://picsum.photos/seed/health2/400/300', reviewCount: 80 },
  ],
  gym: [
    { id: 'g1', name: 'SRM Fitness Center', address: 'Sports Complex', rating: 4.9, imageUrl: 'https://picsum.photos/seed/gym1/400/300', reviewCount: 450 },
    { id: 'g2', name: 'Yoga and Wellness Studio', address: 'Building 5, 2nd Floor', rating: 4.8, imageUrl: 'https://picsum.photos/seed/gym2/400/300', reviewCount: 99 },
  ],
  housing: [
    { id: 'ho1', name: 'Orchid Hostel (Girls)', address: 'West Campus', rating: 4.1, imageUrl: 'https://picsum.photos/seed/housing1/400/300', reviewCount: 150 },
    { id: 'ho2', name: 'Bluebell Hostel (Boys)', address: 'East Campus', rating: 4.0, imageUrl: 'https://picsum.photos/seed/housing2/400/300', reviewCount: 180 },
  ]
};

const categories = [
    { id: 'food', title: 'Food & Dining', subtitle: 'Mess, Canteens & More' },
    { id: 'gym', title: 'Gym & Fitness', subtitle: 'On-campus & Nearby Gyms' },
    { id: 'shops', title: 'Shops & Services', subtitle: 'Xerox, Stationery & More' },
    { id: 'transport', title: 'Transportation', subtitle: 'Buses, Trains & Autos' },
    { id: 'housing', title: 'Housing', subtitle: 'Hostels, PGs & Flats' },
    { id: 'health', title: 'Health & Safety', subtitle: 'Hospital, Pharmacy & SOS' },
];

// --- ICONS ---
const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-orange-300' : 'text-orange-100'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const BookmarkIcon: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
    <svg className={`w-6 h-6 ${filled ? 'text-teal-400' : 'text-rose-300'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Suggest Place Modal ---
const SuggestPlaceModal: React.FC<{
  onClose: () => void;
  onAddPlace: (data: { name: string; address: string; category: string }) => void;
}> = ({ onClose, onAddPlace }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState(categories[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;
    onAddPlace({ name, address, category });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 dark:text-rose-300">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-6 text-center">Suggest a New Place</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="placeName" className="text-sm font-medium text-rose-800 dark:text-rose-200">Place Name</label>
            <input id="placeName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Corner Cafe" required className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium text-rose-800 dark:text-rose-200">Location / Address</label>
            <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g., Near Tech Park" required className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400" />
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium text-rose-800 dark:text-rose-200">Category</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-lime-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-rose-400 text-white font-semibold rounded-lg shadow hover:bg-rose-50 dark:bg-slate-8000 transition-colors">Submit Suggestion</button>
        </form>
      </div>
    </div>
  );
};


// --- COMPONENTS ---
const PlaceCard: React.FC<{ place: Place; isSaved: boolean; onSaveToggle: (id: string) => void; showRemoveButton?: boolean; }> = ({ place, isSaved, onSaveToggle, showRemoveButton }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group relative">
      <img src={place.imageUrl} alt={place.name} className="w-full h-40 object-cover" />
      {showRemoveButton && (
          <button 
              onClick={() => onSaveToggle(place.id)} 
              className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-200 hover:scale-110"
              aria-label={`Remove ${place.name} from saved`}
          >
              <TrashIcon />
          </button>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100">{place.name}</h3>
                <p className="text-sm text-rose-600 dark:text-rose-300">{place.address}</p>
            </div>
            <button onClick={() => onSaveToggle(place.id)} className="p-1 -mt-1 -mr-1" aria-label={`Save ${place.name}`}>
                <BookmarkIcon filled={isSaved} />
            </button>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex" aria-label={`Rating: ${place.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(place.rating)} />)}
          </div>
          <span className="text-rose-700 text-sm ml-2">{place.rating.toFixed(1)} ({place.reviewCount} reviews)</span>
        </div>
      </div>
    </div>
  );
};

const CampusFacilities: React.FC = () => {
    type View = 'idle' | 'loading' | 'results' | 'saved';
    const [places, setPlaces] = useState(initialPlaces);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<{id: string, title: string} | null>(null);
    const [view, setView] = useState<View>('idle');
    const [savedPlaces, setSavedPlaces] = useState<Record<string, string[]>>(() => {
        try {
            const saved = localStorage.getItem('savedCampusPlaces');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error("Failed to parse saved places from localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('savedCampusPlaces', JSON.stringify(savedPlaces));
        } catch (error) {
            console.error("Failed to save places to localStorage", error);
        }
    }, [savedPlaces]);

    const handleAction = (category: {id: string, title: string}, targetView: View) => {
        setActiveCategory(category);
        setView(targetView);
    };

    const handleSaveToggle = (placeId: string) => {
        if (!activeCategory) return;
        const categoryId = activeCategory.id;
        const currentSaved = savedPlaces[categoryId] || [];
        const isSaved = currentSaved.includes(placeId);
        
        const newSaved = isSaved 
            ? currentSaved.filter(id => id !== placeId)
            : [...currentSaved, placeId];

        setSavedPlaces(prev => ({
            ...prev,
            [categoryId]: newSaved,
        }));
    };

    const handleAddPlace = (newPlaceData: { name: string; address: string; category: string }) => {
        const newPlace: Place = {
            id: `${newPlaceData.category}-${Date.now()}`,
            name: newPlaceData.name,
            address: newPlaceData.address,
            rating: 0,
            reviewCount: 0,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
        };

        setPlaces(prevPlaces => {
            const updatedCategoryPlaces = [...(prevPlaces[newPlaceData.category] || []), newPlace];
            return {
                ...prevPlaces,
                [newPlaceData.category]: updatedCategoryPlaces,
            };
        });
    };

    const renderDetailedView = () => {
        if (!activeCategory) return null;

        const placesForCategory = places[activeCategory.id] || [];
        const savedIds = new Set(savedPlaces[activeCategory.id] || []);
        const placesToShow = view === 'results' 
            ? placesForCategory 
            : placesForCategory.filter(p => savedIds.has(p.id));
        const title = view === 'results' ? `Nearby ${activeCategory.title}` : `Your Saved ${activeCategory.title}`;

        return (
          <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-rose-900 dark:text-rose-100">{title}</h2>
                 <button onClick={() => setActiveCategory(null)} className="text-rose-500 dark:text-rose-400 font-semibold hover:underline">
                    &larr; Back to Categories
                 </button>
            </div>
            {placesToShow.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {placesToShow.map(place => (
                        <PlaceCard 
                            key={place.id} 
                            place={place} 
                            isSaved={savedIds.has(place.id)} 
                            onSaveToggle={() => handleSaveToggle(place.id)}
                            showRemoveButton={view === 'saved'}
                        />
                    ))}
                 </div>
            ) : (
                <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-rose-900 dark:text-rose-100">No Saved Places Yet</h3>
                    <p className="text-rose-600 dark:text-rose-300 mt-2">Click the bookmark icon on a place to save it here.</p>
                     <button onClick={() => setView('results')} className="mt-4 px-6 py-2 bg-rose-400 text-white font-semibold rounded-full hover:bg-rose-50 dark:bg-slate-8000 transition-colors">
                        Find Nearby Places
                    </button>
                </div>
            )}
          </div>
        )
    };
    
    const renderCategorySelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => {
                const savedCount = savedPlaces[category.id]?.length || 0;
                return (
                    <div key={category.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 text-center flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100">{category.title}</h3>
                            <p className="text-rose-600 dark:text-rose-300 mb-6">{category.subtitle}</p>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <button onClick={() => handleAction(category, 'results')} className="w-full px-6 py-3 bg-rose-400 text-white font-semibold rounded-full hover:bg-rose-50 dark:bg-slate-8000 transition-colors">
                                Find Nearby
                            </button>
                            <button onClick={() => handleAction(category, 'saved')} className="w-full px-6 py-3 bg-red-300 text-white font-semibold rounded-full hover:bg-red-400 transition-colors">
                                Show Saved ({savedCount})
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    );

    return (
        <section className="py-20 bg-lime-100 dark:bg-slate-800">
            <div className="container mx-auto px-4">
                {!activeCategory && (
                     <div className="text-center mb-12">
                         <div className="flex justify-center items-center mb-4">
                            <svg className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900 dark:text-rose-100">Campus Facilities</h2>
                        </div>
                        <p className="text-lg text-rose-600 dark:text-rose-300 max-w-2xl mx-auto">Discover and save key places around campus.</p>
                         <button 
                            onClick={() => setIsSuggestModalOpen(true)}
                            className="mt-4 inline-flex items-center px-6 py-2 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-300 font-semibold rounded-full border border-rose-200 hover:bg-rose-50 dark:bg-slate-800 transition-colors shadow-sm"
                        >
                            + Suggest a New Place
                        </button>
                    </div>
                )}
                {activeCategory ? renderDetailedView() : renderCategorySelection()}
            </div>
             {isSuggestModalOpen && <SuggestPlaceModal onClose={() => setIsSuggestModalOpen(false)} onAddPlace={handleAddPlace} />}
        </section>
    );
};

export default CampusFacilities;