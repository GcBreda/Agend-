 import React from 'react'
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <p className="text-gray-500 mt-2">Página não encontrada</p>
        <a href="/" className="mt-4 inline-block text-indigo-600 hover:underline">Voltar ao início</a>
      </div>
    </div>
  )
}