"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard</h1>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>
    </ProtectedRoute>
  );
}
