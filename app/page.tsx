'use client';
import FilePicker from '@/components/file-picker/file-picker';
import { initializeGoogleDriveSession } from '@/lib/api/google-drive';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeGoogleDriveSession()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error(
          'Failed to initialize Google Drive session',
          err
        );
      });
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <svg
          className="animate-spin h-12 w-12 text-black dark:text-white mb-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Logging you in to Google Drive…
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          Please wait while we connect your account.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FilePicker />
    </div>
  );
}
