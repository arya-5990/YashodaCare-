import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, ShoppingBag, Star, Tag, ExternalLink, Package, Sparkles } from 'lucide-react';

// ─── Coming Soon Fallback ─────────────────────────────────────────────────────
function ComingSoon() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center px-5 max-w-2xl mx-auto relative z-10"
    >
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-container outline-ghost mb-8 shadow-ambient">
        <span className="text-4xl text-primary animate-pulse">📦</span>
      </div>
      <h1 className="text-display-lg text-primary mb-6">Premium Products</h1>
      <div className="inline-block bg-[#F58220] text-white px-8 py-3 rounded-full font-black tracking-widest uppercase shadow-[0_0_20px_rgba(245,130,32,0.4)]">
        Coming Soon
      </div>
      <p className="text-body-lg text-surface-tint leading-relaxed mt-10 font-medium">
        We are building something amazing. Check back later to explore our fully integrated premium care product ecosystem!
      </p>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-surface-container-lowest rounded-[var(--radius-xl)] outline-ghost shadow-ambient hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-surface-container overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-primary/20" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#74B72E] text-[#0A1929] px-3 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#F58220] text-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Star size={10} fill="white" /> Bestseller
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-error text-on-error px-3 py-1 rounded-full shadow-sm">
              -{product.discount}% Off
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1">
        {product.category && (
          <div className="flex items-center gap-1.5 mb-2">
            <Tag size={11} className="text-surface-tint" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-surface-tint">{product.category}</span>
          </div>
        )}

        <h3 className="text-title-lg font-black text-primary leading-tight mb-2 line-clamp-2">{product.name}</h3>

        {product.description && (
          <p className="text-body-sm text-surface-tint leading-relaxed mb-4 line-clamp-3 flex-1">{product.description}</p>
        )}

        {/* Price row */}
        <div className="mt-auto pt-4 border-t border-surface-container-high flex items-end justify-between gap-3 flex-wrap">
          <div>
            {product.originalPrice && product.originalPrice !== product.price && (
              <p className="text-sm text-surface-tint line-through font-medium">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </p>
            )}
            <p className="text-2xl font-black text-primary leading-none">
              {product.price
                ? `₹${Number(product.price).toLocaleString('en-IN')}`
                : <span className="text-surface-tint text-base font-bold">Price on request</span>
              }
            </p>
          </div>

          {product.link ? (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 shrink-0"
            >
              <ShoppingBag size={14} />
              Buy Now
              <ExternalLink size={12} />
            </a>
          ) : (
            <button className="btn-tertiary text-sm px-5 py-2.5 flex items-center gap-2 shrink-0 opacity-70 cursor-not-allowed" disabled>
              <ShoppingBag size={14} />
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Products Page ───────────────────────────────────────────────────────
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (!snap.empty) {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort: pinned first, then by order field, then newest first
          data.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            return 0;
          });
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Loading state
  if (loading) {
    return (
      <main className="pt-32 md:pt-40 bg-surface min-h-[80vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </main>
    );
  }

  // ── No products → Coming Soon
  if (products.length === 0) {
    return (
      <main className="pt-32 md:pt-40 bg-surface min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bokeh-teal opacity-20 rounded-full blur-[100px] pointer-events-none" />
        <ComingSoon />
      </main>
    );
  }

  // ── Products found → Full catalogue
  return (
    <main className="pt-32 md:pt-40 pb-24 bg-surface min-h-[80vh] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="trust-shield">
              <Sparkles size={16} className="text-tertiary" />
              <span className="text-label-md font-bold text-primary">SmileSathi Store</span>
            </div>
          </div>
          <h1 className="text-display-lg text-primary mb-4 leading-none">Premium Products</h1>
          <p className="text-body-lg text-surface-tint max-w-xl">
            Curated dental care essentials, clinically approved and available exclusively for our members.
          </p>
          <p className="text-label-md text-surface-tint mt-3 font-bold">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-8 bg-surface-container-lowest rounded-[var(--radius-xl)] outline-ghost flex items-start gap-4 max-w-2xl"
        >
          <ShoppingBag size={20} className="text-primary mt-0.5 shrink-0" />
          <p className="text-body-md text-primary italic">
            All products are clinically verified by the SmileSathi team. Members enjoy exclusive pricing and priority dispatch.
          </p>
        </motion.div>

      </div>
    </main>
  );
}
