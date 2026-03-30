import React, { useEffect } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewsSection() {
  const { blogs, fetchBlogs } = useCMSStore();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const latestBlogs = blogs.slice(0, 3);

  if (latestBlogs.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Latest News</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">From Our Blog</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <Link key={blog.id} to="/blogs" className="group">
              <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 transition-all hover:-translate-y-2 hover:shadow-2xl">
                <div className="h-56 overflow-hidden relative">
                  <img src={blog.image_url || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {blog.category}
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-3">
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h4 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h4>
                  <div className="flex items-center text-primary font-bold text-sm gap-2 mt-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Read Story <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
