import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import decapCms from 'vite-plugin-decap-cms'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    decapCms({
      adminPath: 'admin',
      config: {
        local_backend: {
          url: 'http://localhost:8081/api/v1',
          allowed_hosts: ['localhost'],
        },
        backend: {
          name: 'github',
          repo: 'bigsofa1/alstudio',
          branch: 'main',
        },
        mediaFolder: 'public/img/uploads',
        publicFolder: '/img/uploads',
        collections: [
          {
            name: 'images',
            label: 'Images',
            folder: 'content/images',
            create: true,
            slug: '{{slug}}',
            fields: [
              { label: 'Image', name: 'image', widget: 'image' },
              { label: 'Alt Text', name: 'alt', widget: 'string' },
              { label: 'Tags', name: 'tags', widget: 'list' },
              { label: 'Collections', name: 'collections', widget: 'list' },
              { label: 'Order', name: 'order', widget: 'number', default: 0 },
            ],
          },
          {
            name: 'projects',
            label: 'Projects / Tags',
            folder: 'content/projects',
            create: true,
            slug: '{{slug}}',
            fields: [
              { label: 'Name', name: 'name', widget: 'string' },
              { label: 'Slug', name: 'slug', widget: 'string' },
              { label: 'Description', name: 'description', widget: 'text', required: false },
            ],
          },
        ],
      },
    }),
  ],
}) 
