import { create } from 'zustand';
import httpClient from '@/lib/api';
import Cookie from 'js-cookie';

// Helper to get authorization headers from cookies
const getAuthHeaders = () => {
  const token = Cookie.get('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const useContentStore = create((set, get) => ({
  items: [],              // List of all fetched content items
  currentItem: null,      // Single content item loaded by slug (for reading/editing)
  loading: false,         // Loading state for async requests
  error: null,            // Error messages

  // Fetch all content items, optionally filtered by content_type ('blog', 'project', 'gallery')
  fetchContent: async (contentType = null) => {
    set({ loading: true, error: null });
    try {
      const url = contentType ? `/content/?content_type=${contentType}` : '/content/';
      const res = await httpClient.get(url);
      set({ items: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Failed to fetch content items.";
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Fetch a single content item by its URL slug (e.g. for blog post view or editor)
  fetchContentBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.get(`/content/${slug}`);
      set({ currentItem: res.data, loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Content item not found.";
      set({ error: errorMsg, loading: false, currentItem: null });
      return { success: false, error: errorMsg };
    }
  },

  // Create a new content item (Blog, Project, or Gallery)
  // payload format: { title, content_type, content (Editor.js JSON), extra_metadata, tag_names, meta_title, meta_description, is_published }
  createContent: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.post('/content/', payload, getAuthHeaders());
      const newItem = res.data;

      // Prepend to current items list if loaded
      set((state) => ({
        items: [newItem, ...state.items],
        loading: false,
      }));

      return { success: true, data: newItem };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to create content item.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Update an existing content item by ID
  updateContent: async (itemId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await httpClient.put(`/content/${itemId}`, payload, getAuthHeaders());
      const updatedItem = res.data;

      set((state) => ({
        items: state.items.map((item) => (item.id === itemId ? updatedItem : item)),
        currentItem: state.currentItem?.id === itemId ? updatedItem : state.currentItem,
        loading: false,
      }));

      return { success: true, data: updatedItem };
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : (detail?.[0]?.msg || err.message || "Failed to update content item.");
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Delete a content item by ID
  deleteContent: async (itemId) => {
    set({ loading: true, error: null });
    try {
      await httpClient.delete(`/content/${itemId}`, getAuthHeaders());

      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        currentItem: state.currentItem?.id === itemId ? null : state.currentItem,
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Failed to delete content item.";
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Clear current item (useful when unmounting editor)
  clearCurrentItem: () => set({ currentItem: null }),
}));