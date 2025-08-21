import type { CloudCannonJavaScriptV1APIFile } from '@cloudcannon/javascript-api';
import { AlertCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { FileBrowser } from './components/FileBrowser';
import { useCloudCannonAPI } from './hooks/useCloudCannonAPI';

function App() {
	const [selectedFile, setSelectedFile] = useState<CloudCannonJavaScriptV1APIFile | null>(null);

	const { api, isLoading, error, files, refreshFiles, collections } = useCloudCannonAPI();

	const handleFileSelect = (file: CloudCannonJavaScriptV1APIFile) => {
		setSelectedFile(file);
	};

	const handleSaveFile = async (file: CloudCannonJavaScriptV1APIFile, content: string) => {
		if (!api) {
			throw new Error('CloudCannon API not available');
		}

		try {
			// Use the file's set method to save the content
			await file.set(content);

			// Optionally refresh the file list to reflect any changes
			// Note: This might not be necessary as the API should handle updates automatically
			// await refreshFiles();
		} catch (error) {
			console.error('Error saving file:', error);
			throw error;
		}
	};

	// Show loading state while initializing
	if (isLoading && !api) {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<Loader size={48} className="animate-spin mx-auto mb-4 text-blue-500" />
					<p className="text-lg font-medium text-gray-700 mb-2">Initializing CloudCannon API</p>
					<p className="text-sm text-gray-500">Connecting to the editor...</p>
				</div>
			</div>
		);
	}

	// Show error state if API initialization failed
	if (error && !api) {
		return (
			<div className="h-screen flex items-center justify-center bg-red-50">
				<div className="text-center max-w-md">
					<AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
					<h1 className="text-xl font-bold text-red-700 mb-2">CloudCannon API Error</h1>
					<p className="text-red-600 mb-4">{error}</p>
					<div className="text-sm text-gray-600 bg-white p-4 rounded-lg border">
						<p className="font-medium mb-2">Troubleshooting:</p>
						<ul className="text-left space-y-1">
							<li>• Make sure you're running this inside the CloudCannon editor</li>
							<li>• Check that the CloudCannonAPI is available on the window object</li>
							<li>• Verify that the v1 API is supported</li>
							<li>• In development mode, a mock API should be automatically installed</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-gray-100">
			{/* Main content */}
			<div className="flex-1 flex overflow-hidden">
				{/* File browser sidebar */}
				<div className="w-80 flex-shrink-0">
					<FileBrowser
						collections={collections}
						files={files}
						selectedFile={selectedFile}
						onFileSelect={handleFileSelect}
						isLoading={isLoading}
						error={error}
						onRefresh={refreshFiles}
					/>
				</div>

				{/* Code editor */}
				<div className="flex-1 flex">
					<CodeEditor file={selectedFile} onSave={handleSaveFile} />
				</div>
			</div>

			{/* Status bar */}
			<footer className="bg-blue-600 text-white px-4 py-2 text-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4"></div>
					<div className="flex items-center space-x-4">
						<span>CloudCannon API v1</span>
						{api && (
							<span className="flex items-center">
								<div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
								Connected
							</span>
						)}
						{selectedFile && (
							<span>Language: {selectedFile.path.split('.').pop()?.toUpperCase() || 'PLAIN'}</span>
						)}
						<span>Ready</span>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;
