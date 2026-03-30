import React, { useEffect } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogsPage() {
  const { blogs, fetchBlogs } = useCMSStore();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">School News & Blogs</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Stay updated with the latest happenings, achievements, and educational insights from Aspire International.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <article key={blog.id} className="flex flex-col bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={blog.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa18d035?w=600'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {blog.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{blog.title}</h2>
                <p className="text-slate-600 line-clamp-3 mb-6 flex-1">{blog.content}</p>
                <div className="pt-4 border-t border-slate-50 mt-auto">
                    <button className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                        Read Full Story <ArrowRight size={18} />
                    </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
