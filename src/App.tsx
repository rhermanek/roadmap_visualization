import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { FileUpload } from './components/FileUpload';
import { Timeline } from './components/Timeline';
import { ShareButton } from './components/ShareButton';
import { parseExcel } from './utils/excelParser';
import { exportRoadmapWithVisualization } from './utils/excelExporter';
import type { RoadmapData } from './types';
import { FileSpreadsheet, RefreshCw, Download } from 'lucide-react';
import { parseShareUrl } from './utils/urlData';

function App() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const sharedData = parseShareUrl();
    if (sharedData) {
      setData(sharedData);
    }
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const parsedData = await parseExcel(file);
      setData(parsedData);
      setOriginalFile(file);
      // Clear URL param if new file is uploaded
      window.history.replaceState({}, '', window.location.pathname);
    } catch (err) {
      console.error(err);
      setError('Failed to parse Excel file. Please ensure it matches the required format.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setOriginalFile(null);
    setError(null);
    // Clear URL param
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleExport = async () => {
    if (!data || !originalFile) return;
    
    setExporting(true);
    try {
      // Auto-detect year from first item with a date, or default to current year
      const allItems = [
        ...data.ungroupedItems,
        ...data.goals.flatMap(g => g.items)
      ];
      const firstItemWithDate = allItems.find(i => i.start);
      const year = firstItemWithDate?.start?.getFullYear() || new Date().getFullYear();
      
      await exportRoadmapWithVisualization(originalFile, data, year);
    } catch (err) {
      console.error(err);
      setError('Failed to export Excel file. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* App Header */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
            <FileSpreadsheet size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Roadmap Visualizer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {data && (
            <div className="flex items-center gap-3">
              <ShareButton data={data} />
              {originalFile && (
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Download size={16} />
                  {exporting ? 'Exporting...' : 'Export with Visualization'}
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Upload New File
              </button>
            </div>
          )}
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col items-center justify-start overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full mt-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 animate-pulse">Processing your roadmap...</p>
          </div>
        ) : !data ? (
          <div className="w-full max-w-4xl animate-fade-in">
            <div className="text-center mb-12 mt-10">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
                Visualize Your Project Timeline
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Upload your Excel roadmap to generate an interactive, yearly timeline view instantly.
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                {error}
              </div>
            )}

            <FileUpload onUpload={handleUpload} />
            
            {/* Sample Format Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500">
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-3">Type 1 Format</h3>
                <code className="block bg-gray-100 dark:bg-black/30 p-3 rounded border border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-600 dark:text-gray-400">
                  ID, Name, Description, Acceptance Criteria, Start, End, PD, Cost
                </code>
              </div>
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-3">Type 2 Format</h3>
                <code className="block bg-gray-100 dark:bg-black/30 p-3 rounded border border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-600 dark:text-gray-400">
                  ID, Name, Goal, Description, Acceptance Criteria, Start, End, PD, Cost
                </code>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full animate-fade-in">
            <Timeline 
              data={data} 
              year={
                // Auto-detect year from first item with a date, or default to current year
                (() => {
                  const allItems = [
                    ...data.ungroupedItems,
                    ...data.goals.flatMap(g => g.items)
                  ];
                  const firstItemWithDate = allItems.find(i => i.start);
                  return firstItemWithDate?.start?.getFullYear() || new Date().getFullYear();
                })()
              } 
            />
          </div>
        )}
      </main>
    </div>
    </ThemeProvider>
  );
}

export default App;
