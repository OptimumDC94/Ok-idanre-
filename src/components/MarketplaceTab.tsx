import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceItem } from '../types';
import {
  ShoppingBag,
  Search,
  Plus,
  Phone,
  X,
  MapPin,
  Tag,
  CheckCircle2,
  MessageCircle,
  Package,
} from 'lucide-react';

export const MarketplaceTab: React.FC = () => {
  const { marketplaceItems, addMarketplaceItem, selectedLGA, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedItemForContact, setSelectedItemForContact] = useState<MarketplaceItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listing form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MarketplaceItem['category']>('Agri-Produce');
  const [lga, setLga] = useState<MarketplaceItem['lga']>(user.lga || 'Idanre');
  const [pickupLocation, setPickupLocation] = useState(user.community ? `${user.community} Center` : 'Odode Idanre');
  const [imageUrl, setImageUrl] = useState('');
  const [condition, setCondition] = useState<MarketplaceItem['condition']>('Brand New');
  const [sellerPhone, setSellerPhone] = useState(user.phone || '+234 803 000 0000');

  const categories = [
    'All',
    'Agri-Produce',
    'Crafts & Art',
    'Tech Gadgets',
    'Books & Study',
    'Home & Living',
  ];

  const filteredItems = marketplaceItems.filter(item => {
    if (selectedLGA !== 'All' && item.lga !== 'Both' && item.lga !== selectedLGA) return false;
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.pickupLocation.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsedPrice = parseFloat(price);
    if (!title.trim() || isNaN(parsedPrice) || !sellerPhone.trim()) {
      setFormError('Please provide a valid product title, numeric price, and contact phone number.');
      return;
    }

    addMarketplaceItem({
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      category,
      lga,
      sellerPhone: sellerPhone.trim(),
      pickupLocation: pickupLocation.trim() || 'Central Idanre',
      imageUrl: imageUrl.trim() || '',
      condition,
    });

    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setIsListModalOpen(false);
    setToastMessage('Item listed successfully on the Community Marketplace!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Hero */}
      <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-800/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 border border-emerald-700/60 rounded-full text-xs font-semibold text-emerald-200 mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Youth Enterprise & Local Trade</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ok Idanre Community Marketplace
          </h1>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            Support local youth entrepreneurs! Buy and sell farm produce, handcrafted arts, tech gadgets, and study materials with secure in-person pickup across Idanre and Ifedore wards.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setIsListModalOpen(true)}
            className="min-h-[48px] px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>List Product For Sale</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, agricultural goods, crafts, or gadgets..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800">No marketplace items found</h3>
          <p className="text-xs text-stone-500 mt-1">
            Be the first youth to list a product for sale in {selectedLGA === 'All' ? 'Idanre & Ifedore' : `${selectedLGA} LGA`}!
          </p>
          <button
            onClick={() => setIsListModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl"
          >
            List Item For Sale (+20 Pts)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-44 bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-emerald-400/25" />
                  )}
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {item.condition}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-xs font-mono font-bold text-emerald-900 mb-1">
                    ₦{item.price.toLocaleString()}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-3 pt-3 border-t border-stone-100">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{item.pickupLocation}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedItemForContact(item)}
                  className="w-full min-h-[40px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Connect & Pick Up</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List Product Modal */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">List Item For Sale</h2>
                  <p className="text-xs text-stone-500">Post your items for local pickup and community trade (+20 Pts)</p>
                </div>
              </div>
              <button
                onClick={() => setIsListModalOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleListSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Organic Cocoa Powder (500g) or Handcrafted Basket"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Agri-Produce">Agri-Produce</option>
                    <option value="Crafts & Art">Crafts & Art</option>
                    <option value="Tech Gadgets">Tech Gadgets</option>
                    <option value="Books & Study">Books & Study</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">LGA *</label>
                  <select
                    value={lga}
                    onChange={e => setLga(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Idanre">Idanre LGA</option>
                    <option value="Ifedore">Ifedore LGA</option>
                    <option value="Both">Both LGAs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Condition *</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Locally Crafted">Locally Crafted</option>
                    <option value="Tokunbo / Fairly Used">Tokunbo / Fairly Used</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide details about quality, quantity, and product features..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">In-Person Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    placeholder="e.g. Odode Central Market, Idanre"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={sellerPhone}
                    onChange={e => setSellerPhone(e.target.value)}
                    placeholder="+234 803 ..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Product Photo URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://... photo link (optional)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="px-4 py-2.5 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Publish Listing (+20 Pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Contact & Pickup Modal */}
      {selectedItemForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase">
                  {selectedItemForContact.category}
                </span>
                <h2 className="text-base font-bold text-stone-900">{selectedItemForContact.title}</h2>
              </div>
              <button
                onClick={() => setSelectedItemForContact(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">Seller</span>
                  <span className="font-bold text-stone-900">{selectedItemForContact.sellerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">Price</span>
                  <span className="font-bold text-emerald-900 text-sm font-mono">₦{selectedItemForContact.price.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">Pickup Location</span>
                <div className="font-medium text-stone-800 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedItemForContact.pickupLocation} ({selectedItemForContact.lga} LGA)</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">Description</span>
                <p className="text-stone-600 mt-0.5 leading-relaxed">{selectedItemForContact.description}</p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2">
                <a
                  href={`tel:${selectedItemForContact.sellerPhone}`}
                  className="w-full min-h-[44px] px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Seller ({selectedItemForContact.sellerPhone})</span>
                </a>

                <a
                  href={`https://wa.me/${selectedItemForContact.sellerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedItemForContact.sellerName)},%20I%20want%20to%20buy%20your%20item%20"${encodeURIComponent(selectedItemForContact.title)}"%20listed%20on%20Ok%20Idanre%20Marketplace.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Seller</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
