'use client';

import React, { useEffect, useRef } from 'react';
import { useContentStore } from '@/store/useContentStore';

export default function EditorJsWrapper({ onChange, initialData }) {
  const containerRef = useRef(null);
  const editorInstance = useRef(null);
  const uploadImage = useContentStore((state) => state.uploadImage);

  useEffect(() => {
    let isMounted = true;

    // Only initialize if container exists and editor instance is not already created
    if (containerRef.current && !editorInstance.current) {
      import('@editorjs/editorjs').then((EditorJSModule) => {
        if (!isMounted) return;
        const EditorJS = EditorJSModule.default;
        
        import('@editorjs/header').then((HeaderModule) => {
          if (!isMounted) return;
          const Header = HeaderModule.default;
          
          import('@editorjs/image').then((ImageModule) => {
            if (!isMounted) return;
            const ImageTool = ImageModule.default;
            
            import('@editorjs/list').then((ListModule) => {
              if (!isMounted) return;
              const List = ListModule.default;

              // Final check before instantiating
              if (!containerRef.current || editorInstance.current) return;

              const editor = new EditorJS({
                holder: containerRef.current,
                data: initialData || {},
                placeholder: 'Start writing your story or notes here...',
                tools: {
                  header: {
                    class: Header,
                    inlineToolbar: true,
                    config: { levels: [2, 3, 4], defaultLevel: 2 }
                  },
                  list: {
                    class: List,
                    inlineToolbar: true,
                  },
                  image: {
                    class: ImageTool,
                    config: {
                      uploader: {
                        async uploadByFile(file) {
                          const result = await uploadImage(file);
                          return result; // Expected format: { success: 1, file: { url: "..." } }
                        }
                      }
                    }
                  }
                },
                async onChange(api) {
                  const content = await api.saver.save();
                  onChange(content);
                },
              });

              editorInstance.current = editor;
            });
          });
        });
      });
    }

    return () => {
      isMounted = false;
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [uploadImage]); // Exclude initialData to prevent re-triggering on state changes

  return (
    <div 
      className="p-6 sm:p-8 rounded-3xl border shadow-sm min-h-[400px]"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      <div ref={containerRef} className="prose max-w-none" />
    </div>
  );
}