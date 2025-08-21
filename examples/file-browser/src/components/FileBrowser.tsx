import type {
	CloudCannonJavaScriptV1APICollection,
	CloudCannonJavaScriptV1APIFile,
} from '@cloudcannon/javascript-api';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { CollectionBrowser } from './CollectionBrowser';
import { FileTree } from './FileTree';

interface FileBrowserProps {
	files: CloudCannonJavaScriptV1APIFile[];
	collections: CloudCannonJavaScriptV1APICollection[];
	selectedFile: CloudCannonJavaScriptV1APIFile | null;
	onFileSelect: (file: CloudCannonJavaScriptV1APIFile) => void;
	isLoading: boolean;
	error: string | null;
	onRefresh: () => void;
}

export function FileBrowser({
	files,
	collections,
	selectedFile,
	onFileSelect,
	isLoading,
	error,
	onRefresh,
}: FileBrowserProps) {
	if (error) {
		return (
			<div className="p-4">
				<div className="flex items-center text-red-600 mb-4">
					<AlertCircle size={20} className="mr-2" />
					<span className="font-medium">Error loading files</span>
				</div>
				<p className="text-sm text-gray-600 mb-4">{error}</p>
				<button
					type="button"
					onClick={onRefresh}
					className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-white border-r border-gray-200">
			{collections.map((collection) => (
				<CollectionBrowser
					key={collection.collectionKey}
					collection={collection}
					selectedFile={selectedFile}
					onFileSelect={onFileSelect}
					isLoading={isLoading}
					onRefresh={onRefresh}
				/>
			))}

			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b border-t border-gray-200 bg-gray-50">
				<h2 className="font-medium text-gray-700">Files</h2>
				<button
					type="button"
					onClick={onRefresh}
					disabled={isLoading}
					className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
					title="Refresh files"
				>
					<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
				</button>
			</div>

			{/* File tree */}
			<FileTree files={files} selectedFile={selectedFile} onFileSelect={onFileSelect} isLoading={isLoading} />
		</div>
	);
}
