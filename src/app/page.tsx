import React from 'react';

export default function FeedPage() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Public Feed</h1>
      {/* TODO: Fetch posts from API and display in feed order */}
      <div className="w-full max-w-xl space-y-4">
        <div className="p-4 border rounded">
          <div className="font-semibold">[Author Name]</div>
          <div className="text-xs text-gray-500">[Time ago]</div>
          <div className="mt-2">[Post text]</div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">[Author Name]</div>
          <div className="text-xs text-gray-500">[Time ago]</div>
          <div className="mt-2">[Post text]</div>
        </div>
      </div>
    </main>
  );
}
