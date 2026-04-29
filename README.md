# Recycle Mart Dashboard

This is a dashboard application for Recycle Mart, built with Next.js 16, React 19, and TypeScript. The dashboard provides comprehensive management capabilities for various aspects of the recycling business.

## Features

- **User Management**: Create, edit, and manage user accounts with different roles
- **Advertisement Management**: Create and manage ads for recyclable items
- **Category Management**: Organize recyclable items into categories
- **Location Management**: Manage pickup locations for recycling services
- **Lottery System**: Create and manage recycling lotteries
- **Package Management**: Define and manage recycling packages
- **Content Management**: Create and manage static content pages
- **Role-based Access Control**: Different access levels for administrators, staff, and users
- **Analytics Dashboard**: Visualize business metrics with charts and graphs
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn UI
- **Data Management**: React Hook Form, Zod, TanStack Table
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts
- **Validation**: Zod
- **Notifications**: Sonner

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── about-us/       # About us page
│   ├── account/        # User account management
│   ├── ads/            # Advertisement management
│   ├── categories/     # Category management
│   ├── content/        # Content management
│   ├── locations/      # Location management
│   ├── lottery/        # Lottery system
│   ├── packages/       # Package management
│   ├── privacy-policy/ # Privacy policy page
│   ├── roles/          # Role management
│   ├── support/        # Support page
│   └── users/          # User management
├── components/         # Reusable components
│   ├── account/        # Account-related components
│   ├── ads/            # Advertisement components
│   ├── categories/     # Category components
│   ├── dashboard/      # Dashboard components
│   ├── locations/      # Location components
│   ├── lottery/        # Lottery components
│   ├── packages/       # Package components
│   ├── roles/          # Role components
│   ├── support/        # Support components
│   ├── ui/             # UI components (shadcn)
│   └── users/          # User components
├── hooks/              # Custom React hooks
├── layout/             # Layout components
├── lib/                # Utility functions
├── providers/          # React context providers
└── types/              # TypeScript types
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [React Documentation](https://react.dev/) - learn about React concepts
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
