import React, { useEffect, useState } from 'react';
import { useCMSStore, Blog } from '../store/cmsStore';
import { Calendar, User, Tag, ArrowRight, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogsPage() {
  const { blogs, fetchBlogs } = useCMSStore();
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

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
        {blogs.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">No News or Articles Yet</h2>
            <p className="text-slate-500 mt-2">Latest updates and news will appear here soon.</p>
          </div>
        )}
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
                    <button 
                      onClick={() => setSelectedBlog(blog)}
                      className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                    >
                        Read Full Story <ArrowRight size={18} />
                    </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Story Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
            {selectedBlog.image_url && (
              <div className="h-72 w-full overflow-hidden">
                <img
                  src={selectedBlog.image_url}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedBlog.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Calendar size={14} /> {new Date(selectedBlog.created_at).toLocaleDateString()}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <User size={14} /> {selectedBlog.author}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-900 mb-6">
                {selectedBlog.title}
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedBlog.content}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
