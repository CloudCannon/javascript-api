import type {
	Cascade,
	FileInput,
	RichTextInput,
	SnippetConfig,
	UrlInput,
} from '@cloudcannon/configuration-types';

export interface CloseCustomDataPanelOptions {
	parentId: string;
	id: string;
}

export interface OpenCustomDataPanelOptions extends CloseCustomDataPanelOptions {
	data: Record<string, any> | any[] | undefined;
	position?: DOMRect;
	title: string;
	inputConfig: Cascade & SnippetConfig;
	allowFullDataCascade?: boolean;
}

/**
 * Interface defining the public JavaScript API for interacting with CloudCannon's Visual Editor.
 * This API provides methods for managing content, handling file operations, and controlling the
 * editor's state.
 */
export interface CloudCannonJavaScriptAPI {
	/**
	 * Whether event handling is currently enabled
	 */
	eventsEnabled: boolean;
	/**
	 * Whether the API should be installed globally
	 */
	installGlobally: boolean;

	/**
	 * Disables the global installation of the API
	 */
	disableGlobalInstall(): void;

	/**
	 * Enables event handling for the API This will also ensure the commit model is created
	 */
	enableEvents(): void;

	/**
	 * Disables event handling for the API
	 */
	disableEvents(): void;

	/**
	 * Refreshes the editor interface Note: This has been replaced with a MutationObserver in
	 * editor-overlays-view
	 */
	refreshInterface(): void;

	/**
	 * Triggers an update event for a specific file
	 *
	 * @param sourcePath - The path of the file to update
	 */
	triggerUpdateEvent(sourcePath: string): void;

	/**
	 * Sets the loading state of the editor
	 *
	 * @param loadingData - Optional loading state message
	 * @returns Promise that resolves when loading state is updated
	 */
	setLoading(loadingData: string | undefined): Promise<any>;

	/**
	 * Sets data for a specific field
	 *
	 * @param slug - The identifier of the field to set
	 * @param value - The value to set
	 * @returns Promise that resolves when the data is set
	 */
	set(slug: string, value: any): Promise<any>;

	/**
	 * Initiates editing of a specific field
	 *
	 * @param slug - The identifier of the field to edit
	 * @param style - Optional style information
	 * @param e - The mouse event that triggered the edit
	 */
	edit(slug: string, style: string | null, e: MouseEvent): void;

	/**
	 * Opens a custom data panel for editing
	 *
	 * @param options - Configuration options for the panel
	 * @returns Promise that resolves when the panel is opened
	 */
	openCustomDataPanel(options: OpenCustomDataPanelOptions): Promise<void>;

	/**
	 * Closes a custom data panel
	 *
	 * @param options - Configuration options for the panel to close
	 * @returns Promise that resolves when the panel is closed
	 */
	closeCustomDataPanel(options: CloseCustomDataPanelOptions): Promise<void>;

	/**
	 * Uploads a file to the editor
	 *
	 * @param file - The file to upload
	 * @param inputConfig - Optional configuration for the input
	 * @returns Promise that resolves with the path of the uploaded file
	 */
	uploadFile(
		file: File,
		inputConfig: RichTextInput | UrlInput | FileInput | undefined
	): Promise<string | undefined>;

	/**
	 * Adds an item to an array field
	 *
	 * @param slug - The identifier of the array field
	 * @param index - The position to insert at (null for end)
	 * @param value - The value to insert
	 * @param e - The mouse event that triggered the addition
	 * @returns Promise that resolves when the item is added
	 */
	addArrayItem(slug: string, index: number | null, value: any, e: MouseEvent): Promise<void>;

	/**
	 * Adds an item before a specific index in an array field
	 *
	 * @param slug - The identifier of the array field
	 * @param index - The index to insert before
	 * @param value - The value to insert
	 * @param e - The mouse event that triggered the addition
	 * @returns Promise that resolves when the item is added
	 */
	addArrayItemBefore(slug: string, index: number, value: any, e: MouseEvent): Promise<void>;

	/**
	 * Adds an item after a specific index in an array field
	 *
	 * @param slug - The identifier of the array field
	 * @param index - The index to insert after
	 * @param value - The value to insert
	 * @param e - The mouse event that triggered the addition
	 * @returns Promise that resolves when the item is added
	 */
	addArrayItemAfter(slug: string, index: number, value: any, e: MouseEvent): Promise<void>;

	/**
	 * Removes an item from an array field
	 *
	 * @param slug - The identifier of the array field
	 * @param index - The index of the item to remove
	 * @returns Promise that resolves when the item is removed
	 */
	removeArrayItem(slug: string, index: number): Promise<void>;

	/**
	 * Moves an item within an array field
	 *
	 * @param slug - The identifier of the array field
	 * @param index - The current index of the item
	 * @param toIndex - The target index for the item
	 * @returns Promise that resolves when the item is moved
	 */
	moveArrayItem(slug: string, index: number, toIndex: number): Promise<void>;

	/**
	 * Gets the current value of the editor
	 *
	 * @param options - Optional configuration for the value retrieval
	 * @returns Promise that resolves with the current value
	 */
	value(options?: { keepMarkdownAsHTML?: boolean }): Promise<string>;

	/**
	 * Claims a lock on a file
	 *
	 * @param sourcePath - Optional path of the file to lock
	 * @returns Promise that resolves with the lock status
	 */
	claimLock(sourcePath?: string): Promise<{ readOnly: boolean }>;

	/**
	 * Releases a lock on a file
	 *
	 * @param sourcePath - Optional path of the file to unlock
	 * @returns Promise that resolves with the lock status
	 */
	releaseLock(sourcePath?: string): Promise<{ readOnly: boolean }>;

	/**
	 * Gets prefetched files
	 *
	 * @returns Promise that resolves with a record of file blobs
	 */
	prefetchedFiles(): Promise<Record<string, Blob>>;

	/**
	 * Loads legacy Bookshop information
	 *
	 * @returns Promise that resolves with the Bookshop data
	 */
	loadLegacyBookshopInfo(): Promise<any>;
}
