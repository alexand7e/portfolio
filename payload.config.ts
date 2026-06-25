import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),

  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      access: {
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      slug: 'blog',
      admin: { useAsTitle: 'title' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          unique: true,
          required: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
        },
        {
          name: 'contentLegacy',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Markdown legacy importado do Prisma (antes do Lexical)',
          },
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'coverUrl',
          type: 'text',
          admin: { description: 'URL externa de capa (fallback)' },
        },
        {
          name: 'tags',
          type: 'array',
          fields: [{ name: 'tag', type: 'text' }],
        },
        {
          name: 'readTime',
          type: 'number',
          admin: { description: 'Tempo de leitura em minutos' },
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'publishedAt',
          type: 'date',
        },
        {
          name: 'series',
          type: 'relationship',
          relationTo: 'series',
          hasMany: false,
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        imageSizes: [
          { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
          { name: 'card', width: 800, height: 600, position: 'centre' },
          { name: 'featured', width: 1200, height: 630, position: 'centre' },
        ],
      },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      slug: 'projects',
      admin: { useAsTitle: 'title' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          unique: true,
          required: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
        },
        {
          name: 'imageUrl',
          type: 'text',
          admin: { description: 'URL da imagem de capa (externa)' },
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'demoUrl',
          type: 'text',
        },
        {
          name: 'githubUrl',
          type: 'text',
        },
        {
          name: 'technologies',
          type: 'array',
          fields: [{ name: 'technology', type: 'text' }],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Published', value: 'PUBLISHED' },
          ],
          defaultValue: 'DRAFT',
        },
      ],
    },
    {
      slug: 'experiences',
      admin: { useAsTitle: 'position' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'company',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'current',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'location',
          type: 'text',
          localized: true,
        },
        {
          name: 'technologies',
          type: 'array',
          fields: [{ name: 'technology', type: 'text' }],
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { position: 'sidebar' },
        },
      ],
    },
    {
      slug: 'tutorials',
      admin: { useAsTitle: 'title' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          unique: true,
          required: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
        },
        {
          name: 'contentLegacy',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Markdown legacy importado do Prisma (antes do Lexical)',
          },
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'coverUrl',
          type: 'text',
        },
        {
          name: 'difficulty',
          type: 'select',
          options: [
            { label: 'Beginner', value: 'BEGINNER' },
            { label: 'Intermediate', value: 'INTERMEDIATE' },
            { label: 'Advanced', value: 'ADVANCED' },
          ],
          defaultValue: 'BEGINNER',
        },
        {
          name: 'estimatedTime',
          type: 'number',
        },
        {
          name: 'tags',
          type: 'array',
          fields: [{ name: 'tag', type: 'text' }],
        },
        {
          name: 'technologies',
          type: 'array',
          fields: [{ name: 'technology', type: 'text' }],
        },
        {
          name: 'series',
          type: 'relationship',
          relationTo: 'series',
          hasMany: false,
        },
        {
          name: 'seriesOrder',
          type: 'number',
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'publishedAt',
          type: 'date',
        },
      ],
    },
    {
      slug: 'series',
      admin: { useAsTitle: 'title' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          unique: true,
          required: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'tutorials',
          type: 'relationship',
          relationTo: 'tutorials',
          hasMany: true,
        },
      ],
    },
    {
      slug: 'talks',
      admin: { useAsTitle: 'title' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          unique: true,
          required: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'event',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'slidesUrl',
          type: 'text',
        },
        {
          name: 'videoUrl',
          type: 'text',
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'tags',
          type: 'array',
          fields: [{ name: 'tag', type: 'text' }],
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      slug: 'testimonials',
      admin: { useAsTitle: 'name' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'avatarUrl',
          type: 'text',
        },
        {
          name: 'linkedIn',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { position: 'sidebar' },
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      slug: 'uses',
      admin: { useAsTitle: 'name' },
      access: {
        read: () => true,
        admin: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { position: 'sidebar' },
        },
      ],
    },
    {
      slug: 'subscribers',
      admin: { useAsTitle: 'email' },
      access: {
        read: ({ req }) => !!req.user,
        create: () => true,
        update: () => true,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          unique: true,
          required: true,
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'PENDING' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Unsubscribed', value: 'UNSUBSCRIBED' },
          ],
          defaultValue: 'PENDING',
        },
        {
          name: 'locale',
          type: 'text',
          defaultValue: 'pt',
        },
        {
          name: 'token',
          type: 'text',
          unique: true,
          admin: { position: 'sidebar' },
        },
      ],
    },
  ],

  globals: [
    {
      slug: 'site-settings',
      access: {
        read: () => true,
        update: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'siteTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'siteUrl',
          type: 'text',
        },
        {
          name: 'contactEmail',
          type: 'email',
        },
        {
          name: 'githubUrl',
          type: 'text',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
        },
        {
          name: 'giscusRepo',
          type: 'text',
        },
        {
          name: 'giscusRepoId',
          type: 'text',
        },
        {
          name: 'giscusCategory',
          type: 'text',
        },
        {
          name: 'giscusCategoryId',
          type: 'text',
        },
      ],
    },
  ],

  localization: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    fallback: true,
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    schemaName: 'payload',
    idType: 'text',
    push: true,
  }),

  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})