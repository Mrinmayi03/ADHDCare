// src/pages/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      {/* shared header/nav could live here—but NO <BrowserRouter> */}
      <Outlet />
    </div>
  );
}
