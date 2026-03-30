import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  bio: string;
  display_order: number;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export interface Notice {
  id: string;
  content: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image_url: string;
  rating: number;
  display_order: number;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Setting {
  id?: string;
  key: string;
  value: string;
  updated_at?: string;
}

interface CMSStore {
  team: TeamMember[];
  facilities: Facility[];
  stats: Stat[];
  enquiries: Enquiry[];
  notices: Notice[];
  events: SchoolEvent[];
  blogs: Blog[];
  testimonials: Testimonial[];
  settings: Record<string, string>; // key-value map for quick access
  isLoading: boolean;
  error: string | null;
  
  fetchTeam: () => Promise<void>;
  fetchFacilities: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchEnquiries: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchNotices: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  fetchBlogs: () => Promise<void>;
  fetchTestimonials: () => Promise<void>;
  
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: string) => Promise<boolean>;
  
  // Mutations
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<boolean>;
  deleteTeamMember: (id: string) => Promise<boolean>;
  addFacility: (facility: Omit<Facility, 'id'>) => Promise<boolean>;
  deleteFacility: (id: string) => Promise<boolean>;
  
  addNotice: (notice: Omit<Notice, 'id' | 'created_at'>) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  
  addEvent: (event: Omit<SchoolEvent, 'id' | 'created_at'>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  
  addBlog: (blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'created_at'>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  
  updateSetting: (key: string, value: string) => Promise<boolean>;
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  team: [],
  facilities: [],
  stats: [],
  enquiries: [],
  notices: [],
  events: [],
  blogs: [],
  testimonials: [],
  settings: {
    'school_email': 'info@aspireuniversalinternational.com',
    'school_phone': '+91 9431867366',
    'school_address': 'Radha Krishana Colony Pakari, Patna, 800002',
    'facebook_url': '#',
    'instagram_url': '#',
    'twitter_url': '#',
    'welcome_title': 'Welcome to the Future of Education',
    'welcome_message_1': 'We are thrilled to announce the launch of Aspire Universal International School. Our brand new campus is designed to provide a safe, stimulating, and inclusive environment where students can discover their passions and reach their full potential.',
    'welcome_message_2': 'Opening our doors on April 1st, 2026, we blend traditional values with modern educational practices to prepare our students for the challenges of tomorrow. Join us in shaping the leaders, innovators, and compassionate citizens of the future.',
    'director_name': 'Mr. Deepak Kumar Vidyarthi',
    'director_image_url': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  isLoading: false,
  error: null,

  fetchTeam: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
    if (error) set({ error: error.message, isLoading: false });
    else set({ team: data as TeamMember[], isLoading: false });
  },

  fetchFacilities: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('facilities').select('*').order('display_order', { ascending: true });
    if (error) set({ error: error.message, isLoading: false });
    else set({ facilities: data as Facility[], isLoading: false });
  },

  fetchStats: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('stats').select('*').order('display_order', { ascending: true });
    if (error) set({ error: error.message, isLoading: false });
    else set({ stats: data as Stat[], isLoading: false });
  },

  fetchEnquiries: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (error) set({ error: error.message });
    else set({ enquiries: data || [] });
    set({ isLoading: false });
  },

  fetchNotices: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('notices').select('*').order('display_order', { ascending: true });
    if (error) set({ error: error.message });
    else set({ notices: data || [] });
    set({ isLoading: false });
  },

  fetchEvents: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    if (error) set({ error: error.message });
    else set({ events: data || [] });
    set({ isLoading: false });
  },

  fetchBlogs: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) set({ error: error.message });
    else set({ blogs: data || [] });
    set({ isLoading: false });
  },

  fetchTestimonials: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('testimonials').select('*').order('display_order', { ascending: true });
    if (error) set({ error: error.message });
    else set({ testimonials: data || [] });
    set({ isLoading: false });
  },

  fetchSettings: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('school_settings').select('*');
    if (error) {
      set({ error: error.message });
    } else if (data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((s: Setting) => {
        settingsMap[s.key] = s.value;
      });
      set((state) => ({ settings: { ...state.settings, ...settingsMap } }));
    }
    set({ isLoading: false });
  },

  addEnquiry: async (enquiry) => {
    const { error } = await supabase.from('enquiries').insert([enquiry]);
    if (error) { set({ error: error.message }); return false; }
    return true;
  },

  deleteEnquiry: async (id) => {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchEnquiries();
    return true;
  },

  updateEnquiryStatus: async (id, status) => {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchEnquiries();
    return true;
  },

  addTeamMember: async (member) => {
    const { error } = await supabase.from('team_members').insert([member]);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchTeam();
    return true;
  },

  deleteTeamMember: async (id) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchTeam();
    return true;
  },

  addFacility: async (facility) => {
    const { error } = await supabase.from('facilities').insert([facility]);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchFacilities();
    return true;
  },

  deleteFacility: async (id) => {
    const { error } = await supabase.from('facilities').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchFacilities();
    return true;
  },

  addNotice: async (notice) => {
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchNotices();
    return true;
  },

  deleteNotice: async (id) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchNotices();
    return true;
  },

  addEvent: async (event) => {
    const { error } = await supabase.from('events').insert([event]);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchEvents();
    return true;
  },

  deleteEvent: async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchEvents();
    return true;
  },

  addBlog: async (blog) => {
    const { error } = await supabase.from('blogs').insert([blog]);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchBlogs();
    return true;
  },

  deleteBlog: async (id) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchBlogs();
    return true;
  },

  addTestimonial: async (testimonial) => {
    const { error } = await supabase.from('testimonials').insert([testimonial]);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchTestimonials();
    return true;
  },

  deleteTestimonial: async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) { set({ error: error.message }); return false; }
    await get().fetchTestimonials();
    return true;
  },

  updateSetting: async (key, value) => {
    // Upsert equivalent since "key" is UNIQUE constraint in our table.
    // If you don't use upsert properly, we can also query to see if it exists.
    // Supabase has an upsert feature, but we can do it via eq() safely on standard insert configs.
    const { error } = await supabase
      .from('school_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      
    if (error) {
      set({ error: error.message });
      return false;
    }
    await get().fetchSettings();
    return true;
  }
}));
