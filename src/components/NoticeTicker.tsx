import React, { useEffect } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Megaphone } from 'lucide-react';

export default function NoticeTicker() {
  const { notices, fetchNotices } = useCMSStore();

  useEffect(() => {
    fetchNotices();
  }, []);

  const activeNotices = notices.filter(n => n.is_active);

  if (activeNotices.length === 0) return null;

  return (
    <div className="bg-secondary text-white relative overflow-hidden flex items-center h-full shadow-inner border-y border-white/5">
      <div className="flex-shrink-0 bg-primary px-4 h-full z-10 flex items-center gap-2 font-bold shadow-xl">
        <Megaphone size={14} className="animate-bounce" />
        <span className="whitespace-nowrap uppercase tracking-widest text-[10px]">Latest Updates</span>
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          {activeNotices.map((notice, i) => (
            <span key={notice.id} className="text-sm font-semibold tracking-wide">
              {notice.content}
              {i !== activeNotices.length - 1 && <span className="ml-12 text-primary">•</span>}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {activeNotices.map((notice) => (
            <span key={`${notice.id}-clone`} className="text-sm font-semibold tracking-wide">
              {notice.content}
              <span className="ml-12 text-primary">•</span>
            </span>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
