<<<<<<< HEAD
import React from "react";

=======
>>>>>>> 314f9367e2fc5a9386fdd547197cf2cce2d7c34b
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {children}
    </div>
  );
}