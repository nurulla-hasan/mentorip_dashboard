import RootLayoutClient from '@/layout/MainLayout';
import React from 'react'

export default function MainRoutesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RootLayoutClient>{children}</RootLayoutClient>
    )
}
