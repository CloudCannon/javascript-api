import type {
	CloudCannonJavaScriptV1APICollection,
	CloudCannonJavaScriptV1APIFile,
} from '@cloudcannon/javascript-api';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FileTree } from './FileTree';

interface CollectionBrowserProps {
	collection: CloudCannonJavaScriptV1APICollection;
	selectedFile: CloudCannonJavaScriptV1APIFile | null;
	onFileSelect: (file: CloudCannonJavaScriptV1APIFile) => void;
	isLoading: boolean;
	onRefresh: () => void;
}

export function CollectionBrowser({
	collection,
	selectedFile,
	onFileSelect,
	isLoading,
	onRefresh,
}: CollectionBrowserProps) {
	const [items, setItems] = useState<CloudCannonJavaScriptV1APIFile[] | undefined>(undefined);

	useEffect(() => {
		const handleFileChange = async () => {
			const items = await collection.items();
			setItems(items);
		};

		collection.addEventListener('change', handleFileChange);
		collection.addEventListener('create', handleFileChange);
		collection.addEventListener('delete', handleFileChange);
		handleFileChange();

		return () => {
			collection.removeEventListener('change', handleFileChange);
			collection.removeEventListener('create', handleFileChange);
			collection.removeEventListener('delete', handleFileChange);
		};
	}, [collection]);

	return (
		<div className="flex flex-col bg-white border-r border-gray-200">
			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b border-t border-gray-200 bg-gray-50">
				<h2 className="font-medium text-gray-700">{collection.collectionKey}</h2>
				<button
					type="button"
					onClick={onRefresh}
					disabled={isLoading}
					className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
					title="Refresh collection"
				>
					<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
				</button>
			</div>

			<FileTree files={items || []} selectedFile={selectedFile} onFileSelect={onFileSelect} isLoading={isLoading || !items} />
		</div>
	);
}
