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
 * This API provides methods for managing content, handling file operations, and controlling the editor's state.
 * @deprecated Use CloudCannonJavaScriptV1API instead
 */
export interface CloudCannonJavaScriptV0API {
	/** Whether event handling is currently enabled */
	eventsEnabled: boolean;
	/** Whether the API should be installed globally */
	installGlobally: boolean;

	/**
	 * Disables the global installation of the API
	 */
	disableGlobalInstall(): void;

	/**
	 * Enables event handling for the API
	 * This will also ensure the commit model is created
	 */
	enableEvents(): void;

	/**
	 * Disables event handling for the API
	 */
	disableEvents(): void;

	/**
	 * Refreshes the editor interface
	 * Note: This has been replaced with a MutationObserver in editor-overlays-view
	 */
	refreshInterface(): void;

	/**
	 * Triggers an update event for a specific file
	 * @param sourcePath - The path of the file to update
	 */
	triggerUpdateEvent(sourcePath: string): void;

	/**
	 * Sets the loading state of the editor
	 * @param loadingData - Optional loading state message
	 * @returns Promise that resolves when loading state is updated
	 */
	setLoading(loadingData: string | undefined): Promise<any>;

	/**
	 * Sets data for a specific field
	 * @param slug - The identifier of the field to set
	 * @param value - The value to set
	 * @returns Promise that resolves when the data is set
	 */
	set(slug: string, value: any): Promise<any>;

	/**
	 * Initiates editing of a specific field
	 * @param slug - The identifier of the field to edit
	 * @param style - Optional style information
	 * @param e - The mouse event that triggered the edit
	 */
	edit(slug: string, style: string | null, e: MouseEvent): void;

	/**
	 * Opens a custom data panel for editing
	 * @param options - Configuration options for the panel
	 * @returns Promise that resolves when the panel is opened
	 */
	openCustomDataPanel(options: OpenCustomDataPanelOptions): Promise<void>;

	/**
	 * Closes a custom data panel
	 * @param options - Configuration options for the panel to close
	 * @returns Promise that resolves when the panel is closed
	 */
	closeCustomDataPanel(options: CloseCustomDataPanelOptions): Promise<void>;

	/**
	 * Uploads a file to the editor
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
	 * @param slug - The identifier of the array field
	 * @param index - The position to insert at (null for end)
	 * @param value - The value to insert
	 * @param e - The mouse event that triggered the addition
	 * @returns Promise that resolves when the item is added
	 */
	addArrayItem(slug: string, index: number | null, value: any, e: MouseEvent): Promise<void>;

	/**
	 * Adds an item before a specific index in an array field
	 * @param slug - The identifier of the array field
	 * @param index - The index to insert before
	 * @param value - The value to insert
	 * @param e - The mouse event that triggered the addition
	 * @returns Promise that resolves when the item is added
	 */
	addArrayItemBefore(slug: string, index: number, value: any, e: MouseEvent): Promise<void>;

	/**
	 * Adds an item after a specific index in an array field
	 * @param slug - The identifier of the array field
	 * @param index - The index to insert after
	 * @param value - The value to insert
	 * @param e - The mouse event that triggered the addition
	 * @returns Promise that resolves when the item is added
	 */
	addArrayItemAfter(slug: string, index: number, value: any, e: MouseEvent): Promise<void>;

	/**
	 * Removes an item from an array field
	 * @param slug - The identifier of the array field
	 * @param index - The index of the item to remove
	 * @returns Promise that resolves when the item is removed
	 */
	removeArrayItem(slug: string, index: number): Promise<void>;

	/**
	 * Moves an item within an array field
	 * @param slug - The identifier of the array field
	 * @param index - The current index of the item
	 * @param toIndex - The target index for the item
	 * @returns Promise that resolves when the item is moved
	 */
	moveArrayItem(slug: string, index: number, toIndex: number): Promise<void>;

	/**
	 * Gets the current value of the editor
	 * @param options - Optional configuration for the value retrieval
	 * @returns Promise that resolves with the current value
	 */
	value(options?: { keepMarkdownAsHTML?: boolean }): Promise<string>;

	/**
	 * Claims a lock on a file
	 * @param sourcePath - Optional path of the file to lock
	 * @returns Promise that resolves with the lock status
	 */
	claimLock(sourcePath?: string): Promise<{ readOnly: boolean }>;

	/**
	 * Releases a lock on a file
	 * @param sourcePath - Optional path of the file to unlock
	 * @returns Promise that resolves with the lock status
	 */
	releaseLock(sourcePath?: string): Promise<{ readOnly: boolean }>;

	/**
	 * Gets prefetched files
	 * @returns Promise that resolves with a record of file blobs
	 */
	prefetchedFiles(): Promise<Record<string, Blob>>;

	/**
	 * Loads legacy Bookshop information
	 * @returns Promise that resolves with the Bookshop data
	 */
	loadLegacyBookshopInfo(): Promise<any>;
}

/**
 * Options for setting data in the v2 API
 */
export interface SetOptions {
	/** The identifier of the field to set */
	slug: string;
	/** The value to set */
	value: any;
}

/**
 * Options for editing a field in the v2 API
 */
export interface EditOptions {
	/** The identifier of the field to edit */
	slug: string;
	/** Optional style information */
	style?: string | null;
	/** The mouse event that triggered the edit */
	e: MouseEvent;
}

/**
 * Options for array operations in the v2 API
 */
export interface ArrayOptions {
	/** The identifier of the array field */
	slug: string;
}

/**
 * Options for adding an array item in the v2 API
 */
export interface AddArrayItemOptions extends ArrayOptions {
	/** The position to insert at (null for end) */
	index: number | null;
	/**
	 * The position to insert at (before or after)
	 * @default 'before'
	 */
	position?: 'before' | 'after';
	/** The value to insert */
	value: any;
	/** The mouse event that triggered the addition */
	e: MouseEvent;
}

/**
 * Options for moving an array item in the v2 API
 */
export interface MoveArrayItemOptions extends ArrayOptions {
	/** The current index of the item */
	index: number;
	/** The target index for the item */
	toIndex: number;
}

/**
 * Options for moving an array item in the v2 API
 */
export interface RemoveArrayItemOptions extends ArrayOptions {
	/** The current index of the item */
	index: number;
}

/**
 * Options for getting the current value in the v2 API
 */
export interface ValueOptions {
	/**
	 * CloudCannon works with HTML by default. Markdown is converted to HTML and back again while editing.
	 * If true, any markdown inputs will be returned as an HTML string instead of Markdown.
	 */
	keepMarkdownAsHTML?: boolean;
}

export interface FileNotFoundError extends Error {
	message: 'File not found';
}

export interface CollectionNotFoundError extends Error {
	message: 'Collection not found';
}

export interface CloudCannonJavaScriptV1APIFileContent {
	/**
	 * Gets the body content of a file. This is the content of the file without the front matter as a string.
	 * @param options - Optional configuration for the value retrieval
	 * @returns Promise that resolves with the body content of the file
	 * @throws {FileNotFoundError} If the file is not found
	 * @example
	 * ```javascript
	 * const value = await CloudCannon.content({
	 *   keepMarkdownAsHTML: true,
	 * });
	 * ```
	 */
	get(options?: ValueOptions): Promise<string>;

	/**
	 * Sets the body content of a file
	 * @param options - Configuration options for setting body content
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves when the body content is set
	 */
	set(options: any): Promise<void>;

	addEventListener(event: 'change', callback: (event: any) => void): void;
	removeEventListener(event: 'change', callback: (event: any) => void): void;
}

export interface CloudCannonJavaScriptV1APIFileData {
	/**
	 * Gets the data of a file. This will be a JSON object. This is either the data from the file or the data from front matter.
	 * @param options - Optional configuration for the value retrieval
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves with the data of the file
	 * @example
	 * ```javascript
	 * const value = await CloudCannon.data({
	 *   keepMarkdownAsHTML: true,
	 * });
	 * ```
	 */
	get(options?: ValueOptions & { slug?: string }): Promise<Record<string, any> | any[] | undefined>;

	/**
	 * Sets data for a specific field
	 * @param options - Configuration options for setting data
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves when the data is set
	 * @example
	 * ```javascript
	 * await CloudCannon.set({
	 *   slug: 'title',
	 *   value: 'My Title',
	 * });
	 * ```
	 */
	set(options: SetOptions): Promise<any>;

	/**
	 * Initiates editing of a specific field. This will open a data panel for the field.
	 * @param options - Configuration options for editing
	 * @throws {FileNotFoundError} If the file is not found
	 * @example
	 * ```javascript
	 * CloudCannon.edit({
	 *   slug: 'title',
	 *   style: 'panel',
	 *   e: event,
	 * });
	 * ```
	 */
	edit(options: EditOptions): void;

	/**
	 * Uploads a file to an input
	 */
	upload(file: File, options: EditOptions): Promise<string | undefined>;

	/**
	 * Adds an item to an array field
	 * @param options - Configuration options for adding an array item
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves when the item is added
	 * @example
	 * ```javascript
	 * await CloudCannon.addArrayItem({
	 *   slug: 'items',
	 *   value: { title: 'New Item' },
	 *   e: event,
	 * });
	 * ```
	 */
	addArrayItem(options: AddArrayItemOptions): Promise<void>;

	/**
	 * Removes an item from an array field
	 * @param options - Configuration options for removing an array item
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves when the item is removed
	 * @example
	 * ```javascript
	 * await CloudCannon.removeArrayItem({
	 *   slug: 'items',
	 *   index: 1,
	 * });
	 * ```
	 */
	removeArrayItem(options: RemoveArrayItemOptions): Promise<void>;

	/**
	 * Moves an item within an array field
	 * @param options - Configuration options for moving an array item
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves when the item is moved
	 * @example
	 * ```javascript
	 * await CloudCannon.moveArrayItem({
	 *   slug: 'items',
	 *   index: 1,
	 *   toIndex: 2,
	 * });
	 * ```
	 */
	moveArrayItem(options: MoveArrayItemOptions): Promise<void>;

	addEventListener(event: 'change', callback: (event: any) => void): void;
	removeEventListener(event: 'change', callback: (event: any) => void): void;
}

export interface CloudCannonJavaScriptV1APIFile {
	/**
	 * The path of the file
	 */
	path: string;

	/**
	 * The data of the file
	 */
	data: CloudCannonJavaScriptV1APIFileData;

	/**
	 * The content of the file
	 */
	content: CloudCannonJavaScriptV1APIFileContent;

	/**
	 * Gets the body content of a file
	 * @returns Promise that resolves with the body content of the file
	 * @throws {FileNotFoundError} If the file is not found
	 */
	get(): Promise<string>;

	/**
	 * Sets the raw content of a file
	 * @param value - The raw content to set
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves when the raw content is set
	 */
	set(value: string): Promise<void>;

	/**
	 * Gets the metadata of a file
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves with the metadata of the file
	 */
	metadata(): Promise<any>;

	// /**
	//  * Deletes a file
	//  * @throws {FileNotFoundError} If the file is not found
	//  * @returns Promise that resolves when the file is deleted
	//  */
	// delete(): Promise<void>;

	// /**
	//  * Moves a file
	//  * @param options - Configuration options for moving the file
	//  * @throws {FileNotFoundError} If the file is not found
	//  * @returns Promise that resolves when the file is moved
	//  */
	// move(options: any): Promise<CloudCannonJavaScriptV1APIFile>;

	// /**
	//  * Copies a file
	//  * @param options - Configuration options for copying the file
	//  * @throws {FileNotFoundError} If the file is not found
	//  * @returns Promise that resolves when the file is copied
	//  */
	// duplicate(options: any): Promise<CloudCannonJavaScriptV1APIFile>;

	/**
	 * Claims a lock on a file
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves with the lock status
	 */
	claimLock(): Promise<{ readOnly: boolean }>;

	/**
	 * Releases a lock on a file
	 * @throws {FileNotFoundError} If the file is not found
	 * @returns Promise that resolves with the lock status
	 */
	releaseLock(): Promise<{ readOnly: boolean }>;

	addEventListener(event: 'change' | 'delete' | 'create', callback: (event: any) => void): void;
	removeEventListener(event: 'change' | 'delete' | 'create', callback: (event: any) => void): void;
}

export interface CloudCannonJavaScriptV1APICollection {
	/**
	 * Gets the items in a collection
	 * @throws {CollectionNotFoundError} If the collection is not found
	 * @returns Promise that resolves with the items in the collection
	 */
	items(): Promise<CloudCannonJavaScriptV1APIFile[]>;

	// /**
	//  * Adds an item to a collection or triggers an add modal if the provided items are not available.
	//  * @param options - Configuration options for adding an item to a collection
	//  * @throws {CollectionNotFoundError} If the collection is not found
	//  * @returns Promise that resolves with the added item
	//  */
	// add(options: any): Promise<CloudCannonJavaScriptV1APIFile>;

	addEventListener(event: 'change' | 'delete' | 'create', callback: (event: any) => void): void;
	removeEventListener(event: 'change' | 'delete' | 'create', callback: (event: any) => void): void;
}

export interface CloudCannonJavaScriptV1API {
	/**
	 * Gets prefetched files
	 * @returns Promise that resolves with a record of file blobs
	 */
	prefetchedFiles(): Promise<Record<string, Blob>>;

	/**
	 * Sets the loading state of the editor
	 * @param loadingData - Optional loading state message
	 * @returns Promise that resolves when loading state is updated
	 */
	setLoading(loadingData: string | undefined): Promise<any>;

	/**
	 * Opens a custom data panel for editing
	 * @param options - Configuration options for the panel
	 * @returns Promise that resolves when the panel is opened
	 */
	openCustomDataPanel(options: OpenCustomDataPanelOptions): Promise<void>;

	/**
	 * Closes a custom data panel
	 * @param options - Configuration options for the panel to close
	 * @returns Promise that resolves when the panel is closed
	 */
	closeCustomDataPanel(options: CloseCustomDataPanelOptions): Promise<void>;

	/**
	 * Uploads a file to the editor
	 * @param file - The file to upload
	 * @param inputConfig - Optional configuration for the input
	 * @returns Promise that resolves with the path of the uploaded file
	 */
	upload(
		file: File,
		inputConfig: RichTextInput | UrlInput | FileInput | undefined
	): Promise<string | undefined>;

	currentFile(): CloudCannonJavaScriptV1APIFile;
	file(path: string): CloudCannonJavaScriptV1APIFile;
	collection(key: string): CloudCannonJavaScriptV1APICollection;
	files(): Promise<CloudCannonJavaScriptV1APIFile[]>;
	collections(): Promise<CloudCannonJavaScriptV1APICollection[]>;

	addEventListener(event: 'change' | 'delete' | 'create', callback: (event: any) => void): void;
	removeEventListener(event: 'change' | 'delete' | 'create', callback: (event: any) => void): void;
}

export type CloudCannonJavaScriptAPIVersions = 'v0' | 'v1';

export interface CloudCannonApiEventDetails {
	CloudCannonAPI?: CloudCannonJavascriptApiRouter;
	CloudCannon?: CloudCannonJavaScriptV0API | CloudCannonJavaScriptV1API;
}
export interface CloudCannonEditorWindow extends Window, CloudCannonApiEventDetails {}

export interface CloudCannonJavascriptApiRouter {
	useVersion(
		key: CloudCannonJavaScriptAPIVersions,
		preventGlobalInstall?: boolean
	): CloudCannonJavaScriptV0API | CloudCannonJavaScriptV1API;
}
