import React from 'react'
import { Construction, Clock } from 'lucide-react'

const ComingSoon = ({ pageName = "This page" }: { pageName?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
        <div className="mb-6">
          <Construction className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <Clock className="w-8 h-8 mx-auto text-gray-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Under Development
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {pageName} is currently under development. We're working hard to bring you an amazing experience.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            🚀 Coming soon with exciting features!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon