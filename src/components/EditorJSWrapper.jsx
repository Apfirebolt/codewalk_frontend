'use client';

import React, { useEffect, useRef } from 'react';

export default function EditorJsWrapper({ onChange, initialData }) {
  const ref = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    // Dynamically import Editor.js on client side only
    if (!editorInstance.current) {
      import('@editorjs/editorjs').then((EditorJSModule) => {
        const EditorJS = EditorJSModule.default;
        
        import('@editorjs/header').then((HeaderModule) => {
          const Header = HeaderModule.default;
          
          import('@editorjs/image').then((ImageModule) => {
            const ImageTool = ImageModule.default;
            
            import('@editorjs/list').then((ListModule) => {
              const List = ListModule.default;

              const editor = new EditorJS({
                holder: ref.current,
                data: initialData || {},
                placeholder: 'Start writing your story or notes here...',
                tools: {
                  header: {
                    class: Header,
                    inlineToolbar: true,
                    config: {
                      levels: [2, 3, 4],
                      defaultLevel: 2
                    }
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
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_preset');

                          try {
                            // Direct upload to Cloudinary or your backend proxy
                            const response = await fetch(
                              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud'}/image/upload`,
                              { method: 'POST', body: formData }
                            );
                            const data = await response.json();
                            return {
                              success: 1,
                              file: { url: data.secure_url }
                            };
                          } catch (error) {
                            console.error('Image upload failed:', error);
                            return { success: 0 };
                          }
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
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <div 
      className="p-6 sm:p-8 rounded-3xl border shadow-sm min-h-[400px]"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div id="editorjs" ref={ref} className="prose max-w-none" />
    </div>
  );
}