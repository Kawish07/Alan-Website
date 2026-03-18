import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import API from '../api';
import { trackBehavior, trackListingClick, saveProperty, unsaveProperty } from '../api';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Search, SlidersHorizontal, Grid3X3, List, Bed, Bath, Square, Heart,
  X, ChevronDown, ChevronLeft, ChevronRight, Check, MapPin, Home as HomeIcon
} from 'lucide-react';

/* --- Design System --- */
const D = {
  navy: '#1B2A4A', navyDark: '#0F172A', navyLight: '#243B6A',
  accent: '#C4956A', accentLight: '#D4A97A',
  coolWhite: '#F8FAFC', white: '#ffffff',
  slateDark: '#1E293B', slateMed: '#475569', slateLight: '#94A3B8',
  slateBorder: '#E2E8F0',
  display: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
};

/* --- Colorado Neighborhoods / Locations (Section 4.3) — Zip Code Mapping --- */
const NEIGHBORHOOD_ZIPS = {
  'Aurora, CO':           ['80010','80011','80012','80013','80014','80015','80016','80017','80018','80019'],
  'Cherry Creek':         ['80209','80210','80222','80231','80237'],
  'Denver Metro':         ['80002','80003','80004','80005','80007','80010','80011','80012','80013','80014',
                           '80015','80016','80017','80018','80019','80020','80021','80022','80023','80024',
                           '80030','80031','80033','80110','80111','80112','80120','80121','80122','80123',
                           '80124','80125','80126','80127','80128','80129','80130','80131','80150',
                           '80160','80163','80165','80201','80202','80203','80204','80205','80206','80207',
                           '80208','80209','80210','80211','80212','80213','80214','80215','80216','80217',
                           '80218','80219','80220','80221','80222','80223','80224','80225','80226','80227',
                           '80228','80229','80230','80231','80232','80233','80234','80235','80236','80237',
                           '80238','80239','80241','80246','80247','80249'],
  'DTC (Denver Tech Center)': ['80111','80112','80237'],
  'DIA / Green Valley Ranch':  ['80019','80022','80249'],
  'Glendale':             ['80246'],
  'Downtown Denver':      ['80202','80203','80204','80205'],
  'Custom Search (All CO)': [],   // empty = no zip filter
};
const NEIGHBORHOOD_LABELS = Object.keys(NEIGHBORHOOD_ZIPS);

const PROPERTY_TYPES = [
  'Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land/Lot', 'Manufactured', 'Commercial',
];

const BEDS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

const BATHS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '1.5+', value: '1.5' },
  { label: '2+', value: '2' },
  { label: '2.5+', value: '2.5' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
];

/* --- Shared filter select style --- */
const selectStyle = {
  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
  color: '#1E293B', backgroundColor: '#ffffff',
  border: '1px solid #E2E8F0', borderRadius: 8,
  padding: '9px 12px', outline: 'none', cursor: 'pointer',
  minWidth: 0, width: '100%',
};
const inputStyle = {
  fontFamily: "'Inter', sans-serif", fontSize: 13,
  color: '#1E293B', backgroundColor: '#ffffff',
  border: '1px solid #E2E8F0', borderRadius: 8,
  padding: '9px 12px', outline: 'none', width: '100%', minWidth: 0,
};
const labelStyle = {
  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
  letterSpacing: '0.06em', color: '#94A3B8', textTransform: 'uppercase',
  display: 'block', marginBottom: 6,
};

/* --- Fallback Listings (when API unavailable) --- */
const FALLBACK_LISTINGS = [
  { _id: '1', mlsId: 'MLS-2024-001', price: 1295000, address: '5673 E Colfax Ave', city: 'Denver', state: 'CO', beds: 5, baths: 4, sqft: 3800, propertyType: 'Single Family', yearBuilt: 2018, status: 'Active', description: 'Beautifully renovated Denver home featuring a modern open floor plan, chef\'s kitchen with quartz countertops, and a private backyard with mountain views.', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '2', mlsId: 'MLS-2024-002', price: 875000, address: '1204 S Pearl St', city: 'Denver', state: 'CO', beds: 4, baths: 3, sqft: 2850, propertyType: 'Single Family', yearBuilt: 2005, status: 'Active', description: 'Charming Platt Park bungalow with modern upgrades throughout. Walking distance to South Pearl Street shops, restaurants, and Washington Park.', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '3', mlsId: 'MLS-2024-003', price: 2150000, address: '123 Mountain Vista Dr', city: 'Boulder', state: 'CO', beds: 5, baths: 4, sqft: 4200, propertyType: 'Single Family', yearBuilt: 2021, status: 'Active', description: 'Stunning modern masterpiece in the heart of Boulder. Features panoramic Flatiron views, smart home integration, and a private backyard oasis.', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '4', mlsId: 'MLS-2024-004', price: 725000, address: '4845 W Alameda Ave', city: 'Lakewood', state: 'CO', beds: 3, baths: 2, sqft: 2200, propertyType: 'Single Family', yearBuilt: 2012, status: 'Active', description: 'Move-in ready Lakewood gem with updated kitchen, hardwood floors, and a spacious lot. Easy access to Green Mountain trails and Red Rocks.', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '5', mlsId: 'MLS-2024-005', price: 549000, address: '789 Columbine St', city: 'Denver', state: 'CO', beds: 3, baths: 2, sqft: 1850, propertyType: 'Townhouse', yearBuilt: 2016, status: 'Active', description: 'Modern townhouse in the heart of Congress Park. Open concept living, rooftop deck with city views, attached two-car garage.', images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '6', mlsId: 'MLS-2024-006', price: 1750000, address: '456 Mapleton Ave', city: 'Boulder', state: 'CO', beds: 4, baths: 3, sqft: 3400, propertyType: 'Single Family', yearBuilt: 2019, status: 'Active', description: 'Premier Mapleton Hill location with mountain views, gourmet kitchen with Thermador appliances, and professionally landscaped yard.', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '7', mlsId: 'MLS-2024-007', price: 425000, address: '321 Elm St', city: 'Aurora', state: 'CO', beds: 3, baths: 2, sqft: 1600, propertyType: 'Condo', yearBuilt: 2014, status: 'Active', description: 'Bright and airy Aurora condo with open floor plan, granite counters, stainless steel appliances, and a private balcony with Rockies views.', images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '8', mlsId: 'MLS-2024-008', price: 985000, address: '1010 Highlands Dr', city: 'Denver', state: 'CO', beds: 4, baths: 3, sqft: 2900, propertyType: 'Single Family', yearBuilt: 2020, status: 'Active', description: 'Stunning LoHi contemporary with rooftop terrace, downtown skyline views, high-end finishes, and walkable access to restaurants and shops.', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '9', mlsId: 'MLS-2024-009', price: 650000, address: '202 Pine Crest Ln', city: 'Littleton', state: 'CO', beds: 4, baths: 3, sqft: 2600, propertyType: 'Single Family', yearBuilt: 2008, status: 'Active', description: 'Family-friendly Littleton home near top-rated schools. Large fenced yard, updated kitchen, finished basement with home theater.', images: ['https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '10', mlsId: 'MLS-2024-010', price: 389000, address: '555 Wadsworth Blvd', city: 'Arvada', state: 'CO', beds: 2, baths: 2, sqft: 1200, propertyType: 'Condo', yearBuilt: 2017, status: 'Active', description: 'Low-maintenance Arvada condo close to Olde Town. In-unit laundry, modern finishes, community pool, and easy access to I-70 and the mountains.', images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '11', mlsId: 'MLS-2024-011', price: 1450000, address: '780 Cheesman Park Dr', city: 'Denver', state: 'CO', beds: 4, baths: 4, sqft: 3500, propertyType: 'Townhouse', yearBuilt: 2022, status: 'Active', description: 'Luxury new-build townhome bordering Cheesman Park. Four levels of living, elevator-ready, private rooftop with panoramic mountain and city views.', images: ['https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
  { _id: '12', mlsId: 'MLS-2024-012', price: 515000, address: '1601 S Monaco Pkwy', city: 'Denver', state: 'CO', beds: 3, baths: 2, sqft: 1700, propertyType: 'Single Family', yearBuilt: 1998, status: 'Active', description: 'Well-maintained ranch in desirable Goldsmith neighborhood. Hardwood floors, updated bathrooms, and a sun-drenched backyard perfect for entertaining.', images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900'], listingAgent: { name: 'Alan Ramirez', office: 'Colorado Home Finder LLC' } },
];

const SearchPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: searchParams.get('beds') || '',
    baths: searchParams.get('baths') || '',
    neighborhood: searchParams.get('neighborhood') || '',
    // city field also accepts a raw zip via `zip=` param from hero search
    city: searchParams.get('city') || searchParams.get('location') || searchParams.get('zip') || '',
    address: searchParams.get('address') || '',
    propertyType: searchParams.get('propertyType') || '',
    minSqft: searchParams.get('minSqft') || '',
    maxSqft: searchParams.get('maxSqft') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const debounceRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'Search' });
    fetchProperties(1);
    if (isAuthenticated && user?.role === 'user') {
      API.get('/users/me').then(res => {
        const ids = (res.data.savedHomes || []).map(h => typeof h === 'string' ? h : h._id);
        setSavedIds(new Set(ids));
      }).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProperties = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      // Build query — translate neighborhood label into zip codes for the API
      const apiFilters = { ...filters };
      delete apiFilters.neighborhood;
      if (filters.neighborhood && NEIGHBORHOOD_ZIPS[filters.neighborhood]) {
        const zips = NEIGHBORHOOD_ZIPS[filters.neighborhood];
        if (zips.length > 0) {
          apiFilters.zip = zips.join(',');
          delete apiFilters.city; // zip takes precedence over city
        }
      }
      // If the city field looks like a zip code, pass it as zip instead
      if (apiFilters.city && /^\d{5}$/.test(apiFilters.city.trim())) {
        apiFilters.zip = apiFilters.city.trim();
        delete apiFilters.city;
      }
      const params = Object.entries({ ...apiFilters, sort: sortBy, page }).filter(([_, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
      const res = await API.get(`/properties?${params}`);
      const data = res.data?.properties || res.data;
      setProperties(Array.isArray(data) ? data : []);
      if (res.data?.pagination) setPagination(res.data.pagination);
      else setPagination({ page: 1, totalPages: 1, total: Array.isArray(data) ? data.length : 0 });
    } catch {
      // Apply filters to fallback listings so search still works without a backend
      let fallback = [...FALLBACK_LISTINGS];
      // Neighborhood filter — map label to city keywords
      if (filters.neighborhood && filters.neighborhood !== 'Custom Search (All CO)') {
        const nbhd = filters.neighborhood.toLowerCase();
        const zips = NEIGHBORHOOD_ZIPS[filters.neighborhood] || [];
        fallback = fallback.filter(p =>
          p.city?.toLowerCase().includes(nbhd.split(',')[0].trim()) ||
          p.address?.toLowerCase().includes(nbhd.split(',')[0].trim()) ||
          (zips.length > 0 && zips.includes(p.zip))
        );
      }
      const cityQ = (filters.city || '').trim().toLowerCase();
      if (cityQ) {
        if (/^\d{5}$/.test(cityQ)) {
          fallback = fallback.filter(p => p.zip === cityQ);
        } else {
          fallback = fallback.filter(p =>
            p.city?.toLowerCase().includes(cityQ) ||
            p.address?.toLowerCase().includes(cityQ)
          );
        }
      }
      if (filters.address) {
        const addrQ = filters.address.trim().toLowerCase();
        fallback = fallback.filter(p => p.address?.toLowerCase().includes(addrQ));
      }
      if (filters.minPrice) fallback = fallback.filter(p => p.price >= Number(filters.minPrice));
      if (filters.maxPrice) fallback = fallback.filter(p => p.price <= Number(filters.maxPrice));
      if (filters.beds) fallback = fallback.filter(p => p.beds >= Number(filters.beds));
      if (filters.baths) fallback = fallback.filter(p => p.baths >= Number(filters.baths));
      if (filters.propertyType) fallback = fallback.filter(p => p.propertyType === filters.propertyType);
      if (filters.minSqft) fallback = fallback.filter(p => p.sqft >= Number(filters.minSqft));
      if (filters.maxSqft) fallback = fallback.filter(p => p.sqft <= Number(filters.maxSqft));
      setProperties(fallback);
      setPagination({ page: 1, totalPages: 1, total: fallback.length });
    } finally { setLoading(false); }
  }, [filters, sortBy]);

  // Dynamic re-fetch whenever filters or sort change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      trackBehavior('SEARCH_FILTER', filters);
      fetchProperties(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [filters, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    trackBehavior('SEARCH_FILTER', filters);
    fetchProperties(1);
    setShowFilters(false);
  };

  const handleSort = (val) => {
    setSortBy(val);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchProperties(newPage);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const toggleSave = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || user?.role !== 'user') {
      navigate('/login');
      return;
    }
    try {
      if (savedIds.has(propertyId)) {
        await unsaveProperty(propertyId);
        setSavedIds(prev => { const n = new Set(prev); n.delete(propertyId); return n; });
        showToast('Removed from favorites');
      } else {
        await saveProperty(propertyId);
        setSavedIds(prev => new Set(prev).add(propertyId));
        showToast('Saved to favorites!');
      }
    } catch {
      showToast('Please log in to save properties', 'error');
    }
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', beds: '', baths: '', neighborhood: '', city: '', address: '', propertyType: '', minSqft: '', maxSqft: '' });
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div style={{ fontFamily: D.body, backgroundColor: D.coolWhite, minHeight: '100vh' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, backgroundColor: toast.type === 'error' ? '#ef4444' : D.navy, color: D.white, padding: '14px 28px', borderRadius: 12, fontFamily: D.body, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(27,42,74,0.25)', animation: 'fadeInUp 0.3s ease' }}>
          {toast.type !== 'error' && <Check size={16} style={{ color: D.accent }} />}
          {toast.msg}
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Colorado homes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(27,42,74,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: D.body, fontSize: 12, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: D.accent, marginBottom: 16 }}>Colorado MLS Listings</p>
          <h1 style={{ fontFamily: D.display, fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, color: D.white, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>
            Find Your Colorado Home
          </h1>
          <p style={{ fontFamily: D.body, fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 540 }}>
            Browse active listings across the Denver metro area and beyond
          </p>
          <button onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ marginTop: 32, width: 48, height: 48, border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: D.white, transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = D.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}>
            <ChevronDown size={20} />
          </button>
        </div>
      </section>

      {/* ── Prominent Filter Bar ── */}
      <div style={{ backgroundColor: D.white, borderBottom: `1px solid ${D.slateBorder}`, position: 'sticky', top: 60, zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>

          {/* ── Row 1: Primary filters (always visible) ── */}
          <form onSubmit={handleSearch} className="filter-row-primary" style={{ display: 'flex', alignItems: 'end', gap: 12, padding: '16px 0', flexWrap: 'wrap' }}>

            {/* City / Zip Code free-text search */}
            <div className="filter-cell" style={{ flex: '1 1 200px', minWidth: 160 }}>
              <label style={labelStyle}>City or Zip Code</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: D.slateLight, pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Denver, Boulder, 80202..."
                  value={filters.city}
                  onChange={e => updateFilter('city', e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 30 }}
                />
              </div>
            </div>

            {/* Neighborhood / Location (4.3 Zip-Mapped Dropdown) */}
            <div className="filter-cell" style={{ flex: '1 1 220px', minWidth: 170 }}>
              <label style={labelStyle}>Neighborhood</label>
              <select value={filters.neighborhood} onChange={e => updateFilter('neighborhood', e.target.value)} style={selectStyle}>
                <option value="">All Neighborhoods</option>
                {NEIGHBORHOOD_LABELS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Bedrooms */}
            <div className="filter-cell" style={{ flex: '0 1 120px', minWidth: 100 }}>
              <label style={labelStyle}>Beds</label>
              <select value={filters.beds} onChange={e => updateFilter('beds', e.target.value)} style={selectStyle}>
                {BEDS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Bathrooms */}
            <div className="filter-cell" style={{ flex: '0 1 120px', minWidth: 100 }}>
              <label style={labelStyle}>Baths</label>
              <select value={filters.baths} onChange={e => updateFilter('baths', e.target.value)} style={selectStyle}>
                {BATHS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-cell" style={{ flex: '1 1 200px', minWidth: 180 }}>
              <label style={labelStyle}>Price Range</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="number" placeholder="Min $" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} style={{ ...inputStyle, width: '50%' }} />
                <span style={{ color: D.slateLight, fontSize: 12, flexShrink: 0 }}>&ndash;</span>
                <input type="number" placeholder="Max $" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} style={{ ...inputStyle, width: '50%' }} />
              </div>
            </div>

            {/* Sq Ft Range */}
            <div className="filter-cell" style={{ flex: '1 1 200px', minWidth: 180 }}>
              <label style={labelStyle}>Square Footage</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="number" placeholder="Min" value={filters.minSqft} onChange={e => updateFilter('minSqft', e.target.value)} style={{ ...inputStyle, width: '50%' }} />
                <span style={{ color: D.slateLight, fontSize: 12, flexShrink: 0 }}>&ndash;</span>
                <input type="number" placeholder="Max" value={filters.maxSqft} onChange={e => updateFilter('maxSqft', e.target.value)} style={{ ...inputStyle, width: '50%' }} />
              </div>
            </div>

            {/* Property Type */}
            <div className="filter-cell" style={{ flex: '0 1 180px', minWidth: 150 }}>
              <label style={labelStyle}>Property Type</label>
              <select value={filters.propertyType} onChange={e => updateFilter('propertyType', e.target.value)} style={selectStyle}>
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* More Filters toggle + View toggle + Search */}
            <div style={{ display: 'flex', alignItems: 'end', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
              <button type="button" onClick={() => setShowFilters(!showFilters)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: showFilters ? D.coolWhite : 'none', border: `1px solid ${D.slateBorder}`, borderRadius: 8, cursor: 'pointer', fontFamily: D.body, fontSize: 12, fontWeight: 500, color: D.slateDark, transition: 'all 0.15s' }}>
                <SlidersHorizontal size={14} /> More
                {activeFilterCount > 0 && (
                  <span style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: D.accent, color: D.white, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>
                )}
              </button>

              {/* View toggle */}
              <div style={{ display: 'flex', gap: 2, border: `1px solid ${D.slateBorder}`, borderRadius: 8, overflow: 'hidden' }}>
                {[['grid', Grid3X3], ['list', List]].map(([v, Icon]) => (
                  <button key={v} type="button" onClick={() => setView(v)}
                    style={{ width: 34, height: 34, border: 'none', cursor: 'pointer', backgroundColor: view === v ? D.navy : D.white, color: view === v ? D.white : D.slateLight, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    <Icon size={14} />
                  </button>
                ))}
              </div>

              <button type="submit"
                style={{ backgroundColor: D.navy, color: D.white, padding: '9px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: D.body, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, transition: 'background-color 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = D.navyLight}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = D.navy}>
                <Search size={14} /> Search
              </button>
            </div>
          </form>

          {/* ── Row 2: Extra filters (collapsible) ── */}
          {showFilters && (
            <div style={{ padding: '16px 0', borderTop: `1px solid ${D.slateBorder}`, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'end' }}>

              {/* Sort */}
              <div className="filter-cell" style={{ flex: '0 1 160px', minWidth: 140 }}>
                <label style={labelStyle}>Sort By</label>
                <select value={sortBy} onChange={e => handleSort(e.target.value)} style={selectStyle}>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="beds">Most Bedrooms</option>
                </select>
              </div>

              {/* Clear All */}
              <button type="button" onClick={clearFilters}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${D.slateBorder}`, borderRadius: 8, cursor: 'pointer', fontFamily: D.body, fontSize: 12, fontWeight: 500, padding: '9px 16px', color: D.slateLight, marginLeft: 'auto', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = D.accent; e.currentTarget.style.color = D.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = D.slateBorder; e.currentTarget.style.color = D.slateLight; }}>
                <X size={13} /> Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div id="listings" style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: D.display, fontSize: 28, fontWeight: 700, color: D.navy, letterSpacing: '-0.02em' }}>Active Listings</h2>
            <p style={{ fontFamily: D.body, fontSize: 13, color: D.slateMed, marginTop: 4 }}>
              {pagination.total || properties.length} properties found
              {pagination.totalPages > 1 && ` \u00b7 Page ${pagination.page} of ${pagination.totalPages}`}
            </p>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters}
              style={{ fontFamily: D.body, fontSize: 12, fontWeight: 500, color: D.accent, background: 'none', border: `1px solid ${D.accent}`, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = D.accent; e.currentTarget.style.color = D.white; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = D.accent; }}>
              <X size={13} /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: D.white }}>
                <div style={{ height: 220, backgroundColor: D.slateBorder, animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 20, width: '60%', backgroundColor: D.slateBorder, borderRadius: 6, marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: 14, width: '80%', backgroundColor: D.slateBorder, borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: 14, width: '40%', backgroundColor: D.slateBorder, borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <HomeIcon size={48} style={{ color: D.slateLight, marginBottom: 16 }} />
            <h3 style={{ fontFamily: D.display, fontSize: 24, fontWeight: 700, color: D.navy, marginBottom: 8 }}>No Properties Found</h3>
            <p style={{ fontFamily: D.body, fontSize: 14, color: D.slateMed, marginBottom: 24 }}>
              Try adjusting your filters or search terms
            </p>
            <button onClick={clearFilters}
              style={{ fontFamily: D.body, fontSize: 13, fontWeight: 600, color: D.white, backgroundColor: D.navy, border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer' }}>
              Clear All Filters
            </button>
          </div>
        ) : view === 'list' ? (
          /* List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {properties.map((p) => (
              <PropertyListCard key={p._id} property={p} savedIds={savedIds} onToggleSave={toggleSave} />
            ))}
          </div>
        ) : (
          /* Grid View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {properties.map(p => <PropertyGridCard key={p._id} property={p} savedIds={savedIds} onToggleSave={toggleSave} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}
              style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${D.slateBorder}`, backgroundColor: D.white, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: pagination.page <= 1 ? D.slateLight : D.slateDark, opacity: pagination.page <= 1 ? 0.5 : 1 }}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 7) { pageNum = i + 1; }
              else if (pagination.page <= 4) { pageNum = i + 1; }
              else if (pagination.page >= pagination.totalPages - 3) { pageNum = pagination.totalPages - 6 + i; }
              else { pageNum = pagination.page - 3 + i; }
              const active = pageNum === pagination.page;
              return (
                <button key={pageNum} onClick={() => handlePageChange(pageNum)}
                  style={{ width: 40, height: 40, borderRadius: 8, border: active ? 'none' : `1px solid ${D.slateBorder}`, backgroundColor: active ? D.navy : D.white, color: active ? D.white : D.slateDark, fontFamily: D.body, fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}
              style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${D.slateBorder}`, backgroundColor: D.white, cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: pagination.page >= pagination.totalPages ? D.slateLight : D.slateDark, opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* IDX Attribution */}
        <div style={{ marginTop: 48, padding: '24px 0', borderTop: `1px solid ${D.slateBorder}`, textAlign: 'center' }}>
          <p style={{ fontFamily: D.body, fontSize: 11, color: D.slateLight, lineHeight: 1.7 }}>
            Listing data provided by REcolorado MLS. Information deemed reliable but not guaranteed.
            <br />All listings are subject to prior sale, change, or withdrawal. Equal Housing Opportunity.
            <br />{'\u00a9'} {new Date().getFullYear()} Colorado Home Finder LLC {'\u00b7'} Alan Ramirez {'\u00b7'} License #FA100104608 {'\u00b7'} MLS ID 165065183
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @media (max-width: 900px) {
          .filter-row-primary { gap: 10px !important; }
          .filter-cell { flex: 1 1 calc(50% - 8px) !important; min-width: 0 !important; }
        }
        @media (max-width: 600px) {
          .filter-cell { flex: 1 1 100% !important; }
          .resp-list-card { flex-direction: column !important; }
          .resp-list-card-img { width: 100% !important; height: 200px !important; }
          .resp-list-card-content { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
};

/* --- List Card --- */
const PropertyListCard = ({ property: p, savedIds, onToggleSave }) => {
  const [hovered, setHovered] = useState(false);
  const isSaved = savedIds.has(p._id);

  return (
    <div style={{ position: 'relative', backgroundColor: D.white, borderRadius: 12, overflow: 'hidden', border: `1px solid ${D.slateBorder}`, transition: 'box-shadow 0.25s', boxShadow: hovered ? '0 8px 30px rgba(27,42,74,0.1)' : '0 1px 3px rgba(0,0,0,0.04)' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link to={`/property/${p._id}`}
        onClick={() => trackListingClick(p._id, p.address)}
        className="resp-list-card"
        style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}>

        {/* Image */}
        <div className="resp-list-card-img" style={{ width: 380, height: 260, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={p.images?.[0]} alt={p.address}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
          {/* Status badge */}
          <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: p.status === 'Pending' ? '#f59e0b' : p.status === 'Sold' ? '#ef4444' : D.navy, color: D.white, fontFamily: D.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 6 }}>
            {p.status || 'Active'}
          </span>
          {p.mlsId && (
            <span style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(15,23,42,0.75)', color: 'rgba(255,255,255,0.85)', fontFamily: D.body, fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
              MLS# {p.mlsId}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="resp-list-card-content" style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: D.display, fontSize: 26, fontWeight: 700, color: D.navy, marginBottom: 4, letterSpacing: '-0.02em' }}>
            ${p.price?.toLocaleString()}
          </p>
          <p style={{ fontFamily: D.body, fontSize: 14, fontWeight: 500, color: D.slateDark, marginBottom: 4 }}>
            {p.address}
          </p>
          <p style={{ fontFamily: D.body, fontSize: 13, color: D.slateMed, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} /> {p.city}, {p.state || 'CO'}
          </p>

          {/* Property stats */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              [Bed, `${p.beds} Beds`],
              [Bath, `${p.baths} Baths`],
              [Square, `${p.sqft?.toLocaleString()} Sq Ft`],
              ...(p.propertyType ? [[HomeIcon, p.propertyType]] : []),
            ].map(([Icon, label], j) => (
              <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: D.body, fontSize: 12, fontWeight: 500, color: D.slateMed }}>
                <Icon size={14} style={{ color: D.accent }} /> {label}
              </span>
            ))}
          </div>

          {p.description && (
            <p style={{ fontFamily: D.body, fontSize: 13, lineHeight: 1.7, color: D.slateMed, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 16 }}>
              {p.description}
            </p>
          )}

          {/* Listing agent attribution */}
          {p.listingAgent?.name && (
            <p style={{ fontFamily: D.body, fontSize: 11, color: D.slateLight }}>
              Listed by {p.listingAgent.name}{p.listingAgent.office ? ` \u00b7 ${p.listingAgent.office}` : ''}
            </p>
          )}
        </div>
      </Link>

      {/* Save button */}
      <button onClick={(e) => onToggleSave(e, p._id)}
        style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', backdropFilter: 'blur(4px)' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : D.slateDark} />
      </button>
    </div>
  );
};

/* --- Grid Card --- */
const PropertyGridCard = ({ property: p, savedIds, onToggleSave }) => {
  const [hovered, setHovered] = useState(false);
  const isSaved = savedIds.has(p._id);

  return (
    <div style={{ position: 'relative', backgroundColor: D.white, borderRadius: 12, overflow: 'hidden', border: `1px solid ${D.slateBorder}`, transition: 'box-shadow 0.25s, transform 0.25s', boxShadow: hovered ? '0 8px 30px rgba(27,42,74,0.1)' : '0 1px 3px rgba(0,0,0,0.04)', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link to={`/property/${p._id}`}
        onClick={() => trackListingClick(p._id, p.address)}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>

        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <img src={p.images?.[0]} alt={p.address}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
          {/* Status badge */}
          <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: p.status === 'Pending' ? '#f59e0b' : p.status === 'Sold' ? '#ef4444' : D.navy, color: D.white, fontFamily: D.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 6 }}>
            {p.status || 'Active'}
          </span>
          {p.mlsId && (
            <span style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(15,23,42,0.75)', color: 'rgba(255,255,255,0.85)', fontFamily: D.body, fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
              MLS# {p.mlsId}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          <p style={{ fontFamily: D.display, fontSize: 24, fontWeight: 700, color: D.navy, marginBottom: 4, letterSpacing: '-0.02em' }}>
            ${p.price?.toLocaleString()}
          </p>
          <p style={{ fontFamily: D.body, fontSize: 14, fontWeight: 500, color: D.slateDark, marginBottom: 2 }}>{p.address}</p>
          <p style={{ fontFamily: D.body, fontSize: 12, color: D.slateMed, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} /> {p.city}, {p.state || 'CO'}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 14, borderTop: `1px solid ${D.slateBorder}` }}>
            {[
              [Bed, `${p.beds} Beds`],
              [Bath, `${p.baths} Baths`],
              [Square, `${p.sqft?.toLocaleString()} Sq Ft`],
            ].map(([Icon, label], j) => (
              <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: D.body, fontSize: 12, fontWeight: 500, color: D.slateMed }}>
                <Icon size={13} style={{ color: D.accent }} /> {label}
              </span>
            ))}
          </div>

          {/* Listing agent */}
          {p.listingAgent?.name && (
            <p style={{ fontFamily: D.body, fontSize: 10, color: D.slateLight, marginTop: 12 }}>
              Listed by {p.listingAgent.name}
            </p>
          )}
        </div>
      </Link>

      {/* Save button */}
      <button onClick={(e) => onToggleSave(e, p._id)}
        style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isSaved ? 1 : (hovered ? 1 : 0), transition: 'opacity 0.2s, transform 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : D.slateDark} />
      </button>
    </div>
  );
};

export default SearchPage;
