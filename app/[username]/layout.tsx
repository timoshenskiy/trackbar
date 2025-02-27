import React from "react";

import Sidebar from "@/components/Sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-quokka-darker text-quokka-light">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
