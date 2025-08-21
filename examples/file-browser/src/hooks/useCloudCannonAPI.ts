import type {
	CloudCannonApiEventDetails,
	CloudCannonEditorWindow,
	CloudCannonJavaScriptV1API,
	CloudCannonJavaScriptV1APICollection,
	CloudCannonJavaScriptV1APIFile,
	CloudCannonJavascriptApiRouter,
} from '@cloudcannon/javascript-api';
import { useEffect, useState } from 'react';
// import { installMockAPIIfNeeded } from '../utils/mockAPI';

export interface UseCloudCannonAPIReturn {
	api: CloudCannonJavaScriptV1API | null;
	isLoading: boolean;
	error: string | null;
	files: CloudCannonJavaScriptV1APIFile[];
	collections: CloudCannonJavaScriptV1APICollection[];
	refreshFiles: () => Promise<void>;
}

export function useCloudCannonAPI(): UseCloudCannonAPIReturn {
	const [api, setApi] = useState<CloudCannonJavaScriptV1API | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [files, setFiles] = useState<CloudCannonJavaScriptV1APIFile[]>([]);
	const [collections, setCollections] = useState<CloudCannonJavaScriptV1APICollection[]>([]);
	const [CloudCannonAPI, setCloudCannonApi] = useState<CloudCannonJavascriptApiRouter | undefined>(
		undefined
	);

	// Install mock API in development mode if needed
	// useEffect(() => {
	//   installMockAPIIfNeeded();
	// }, []);

	const refreshFiles = async () => {
		if (!api) return;

		try {
			setIsLoading(true);
			const fileList = await api.files();
			setFiles(fileList);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load files');
			console.error('Error loading files:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const win = window as CloudCannonEditorWindow;
		if (win.CloudCannonAPI) {
			console.log('CloudCannonAPI found in window');
			setCloudCannonApi(win.CloudCannonAPI);
			return;
		}

		console.log('Added listener for cloudcannon:load');
		document.addEventListener('cloudcannon:load', function (
			e: CustomEvent<CloudCannonApiEventDetails>
		) {
			console.log('CloudCannonAPI found in event');
			setCloudCannonApi(e.detail.CloudCannonAPI);
		} as EventListener);
	}, []);

	useEffect(() => {
		const initializeAPI = async () => {
			try {
				setIsLoading(true);
				setError(null);

				if (!CloudCannonAPI) {
					throw new Error(
						'CloudCannonAPI not found. Make sure this app is running within the CloudCannon editor.'
					);
				}

				// Use version 1 of the API
				const v1API = CloudCannonAPI.useVersion('v1') as CloudCannonJavaScriptV1API;

				if (!v1API) {
					throw new Error('Failed to initialize CloudCannon API v1');
				}

				setApi(v1API);

				// Load initial files
				const fileList = await v1API.files();
				setFiles(fileList);

				const collections = await v1API.collections();
				setCollections(collections);

				// Set up event listeners for file changes
				const handleFileChange = async () => {
					const fileList = await v1API.files();
					setFiles(fileList);

					const collections = await v1API.collections();
					setCollections(collections);
				};

				v1API.addEventListener('change', handleFileChange);
				v1API.addEventListener('create', handleFileChange);
				v1API.addEventListener('delete', handleFileChange);

				// Cleanup function will be returned from useEffect
				return () => {
					v1API.removeEventListener('change', handleFileChange);
					v1API.removeEventListener('create', handleFileChange);
					v1API.removeEventListener('delete', handleFileChange);
				};
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Failed to initialize CloudCannon API';
				setError(errorMessage);
				console.error('CloudCannon API initialization error:', err);
			} finally {
				setIsLoading(false);
			}
		};

		const cleanup = initializeAPI();

		// Return cleanup function
		return () => {
			cleanup.then((cleanupFn) => {
				if (cleanupFn) cleanupFn();
			});
		};
	}, [CloudCannonAPI]);

	return {
		api,
		isLoading,
		error,
		files,
		collections,
		refreshFiles,
	};
}
