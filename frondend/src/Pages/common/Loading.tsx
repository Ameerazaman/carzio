import React from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <svg
          className="animate-spin h-12 w-12 text-blue-500 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 20c-4.962 0-9-4.038-9-9s4.038-9 9-9 9 4.038 9 9-4.038 9-9 9zm-3.9-8.45a6.94 6.94 0 01-.9-.6v3.4h3.4a6.94 6.94 0 01-.6-.9L8.1 12.55zm5.9.45l-.9 1.55a6.94 6.94 0 01-.6.9h3.4v-3.4a6.94 6.94 0 01-.9.6zm-6-3l1.55-.9c.2-.1.4-.3.6-.6L7.7 8.1H4.3v3.4c.3-.2.5-.4.8-.6zm10.7 0v-3.4h-3.4l-.9 1.55a6.94 6.94 0 01.6.6l1.55.9c.3.2.5.4.8.6z" />
        </svg>
        <p className="mt-4 text-lg font-medium text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
