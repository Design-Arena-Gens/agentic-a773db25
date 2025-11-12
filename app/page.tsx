'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter your news content');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            YouTube News SEO Optimizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered title, tags, and hashtags generator for news channels
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenAI API Key (Optional - leave blank to use server default)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your News Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your news content here... Describe what your video is about in detail."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:transform-none"
          >
            {loading ? 'Analyzing...' : 'Generate SEO Content'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Optimized Title
                </h2>
                <button
                  onClick={() => copyToClipboard(result.title)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {result.title}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tags
                </h2>
                <button
                  onClick={() => copyToClipboard(result.tags.join(', '))}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Hashtags
                </h2>
                <button
                  onClick={() => copyToClipboard(result.hashtags.join(' '))}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((hashtag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-mono"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {result.trendAnalysis && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Trend Analysis
                </h2>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-line">
                  {result.trendAnalysis}
                </p>
              </div>
            )}

            {result.explanation && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Strategy Explanation
                </h2>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-line">
                  {result.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            How to Use This Tool
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter your news content in detail</li>
            <li>Optionally provide your OpenAI API key for better results</li>
            <li>Click "Generate SEO Content"</li>
            <li>The AI will analyze trending content and generate optimized titles, tags, and hashtags</li>
            <li>The title will be crafted to create curiosity without revealing the full news</li>
            <li>Copy and use the generated content for your YouTube video</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
