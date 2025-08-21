import type { CloudCannonJavaScriptV1APIFile } from '@cloudcannon/javascript-api';
import Editor from '@monaco-editor/react';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

// Monaco editor global
declare const monaco: typeof import('monaco-editor');

interface CodeEditorProps {
	file: CloudCannonJavaScriptV1APIFile | null;
	onSave?: (file: CloudCannonJavaScriptV1APIFile, content: string) => Promise<void>;
}

function getLanguageFromPath(path: string): string {
	const ext = path.split('.').pop()?.toLowerCase();

	const languageMap: Record<string, string> = {
		js: 'javascript',
		jsx: 'javascript',
		ts: 'typescript',
		tsx: 'typescript',
		html: 'html',
		htm: 'html',
		css: 'css',
		scss: 'scss',
		sass: 'sass',
		less: 'less',
		json: 'json',
		xml: 'xml',
		md: 'markdown',
		markdown: 'markdown',
		yml: 'yaml',
		yaml: 'yaml',
		py: 'python',
		rb: 'ruby',
		php: 'php',
		java: 'java',
		c: 'c',
		cpp: 'cpp',
		h: 'c',
		hpp: 'cpp',
		cs: 'csharp',
		go: 'go',
		rs: 'rust',
		sh: 'shell',
		bash: 'shell',
		sql: 'sql',
		r: 'r',
		dockerfile: 'dockerfile',
	};

	return languageMap[ext || ''] || 'plaintext';
}

export function CodeEditor({ file, onSave }: CodeEditorProps) {
	const [content, setContent] = useState('');
	const [originalContent, setOriginalContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving' | null>(null);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

	const hasUnsavedChanges = content !== originalContent;

	useEffect(() => {
		if (!file) {
			setContent('');
			setOriginalContent('');
			setError(null);
			setSaveStatus(null);
			return;
		}

		const loadFileContent = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const fileContent = await file.get();
				setContent(fileContent);
				setOriginalContent(fileContent);
				setSaveStatus('saved');
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Failed to load file content';
				setError(errorMessage);
				console.error('Error loading file content:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadFileContent();
	}, [file]);

	useEffect(() => {
		if (hasUnsavedChanges && saveStatus !== 'saving') {
			setSaveStatus('unsaved');
		}
	}, [hasUnsavedChanges, saveStatus]);

	const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
		editorRef.current = editor;

		// Add keyboard shortcuts
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
			handleSave();
		});
	};

	const handleSave = async () => {
		if (!file || !onSave || !hasUnsavedChanges || isSaving) {
			return;
		}

		setIsSaving(true);
		setSaveStatus('saving');
		setError(null);

		try {
			await onSave(file, content);
			setOriginalContent(content);
			setSaveStatus('saved');

			// Show saved status briefly
			setTimeout(() => {
				if (saveStatus === 'saved' && !hasUnsavedChanges) {
					setSaveStatus(null);
				}
			}, 2000);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to save file';
			setError(errorMessage);
			setSaveStatus('unsaved');
			console.error('Error saving file:', err);
		} finally {
			setIsSaving(false);
		}
	};

	if (!file) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
				<div className="text-center">
					<div className="text-4xl mb-4">📁</div>
					<p className="text-lg font-medium mb-2">No file selected</p>
					<p className="text-sm">Select a file from the file browser to start editing</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 flex items-center justify-center bg-red-50">
				<div className="text-center text-red-600">
					<AlertCircle size={48} className="mx-auto mb-4" />
					<p className="text-lg font-medium mb-2">Error loading file</p>
					<p className="text-sm">{error}</p>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50">
				<div className="text-center text-gray-500">
					<div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
					<p>Loading file content...</p>
				</div>
			</div>
		);
	}

	const language = getLanguageFromPath(file.path);

	return (
		<div className="flex-1 flex flex-col">
			{/* Editor header */}
			<div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
				<div className="flex items-center">
					<span className="font-medium text-gray-700">{file.path}</span>
					{hasUnsavedChanges && (
						<span className="ml-2 w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
					)}
				</div>

				<div className="flex items-center space-x-2">
					{/* Save status indicator */}
					{saveStatus === 'saving' && (
						<div className="flex items-center text-blue-600 text-sm">
							<div className="animate-spin w-4 h-4 border border-blue-600 border-t-transparent rounded-full mr-2" />
							Saving...
						</div>
					)}
					{saveStatus === 'saved' && (
						<div className="flex items-center text-green-600 text-sm">
							<CheckCircle size={16} className="mr-1" />
							Saved
						</div>
					)}
					{saveStatus === 'unsaved' && (
						<div className="flex items-center text-orange-600 text-sm">
							<div className="w-2 h-2 bg-orange-400 rounded-full mr-2" />
							Unsaved changes
						</div>
					)}

					{/* Save button */}
					<button
						type="button"
						onClick={handleSave}
						disabled={!hasUnsavedChanges || isSaving}
						className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Save size={14} className="mr-1" />
						Save
					</button>
				</div>
			</div>

			{/* Monaco Editor */}
			<div className="flex-1">
				<Editor
					height="100%"
					language={language}
					value={content}
					onChange={(value) => setContent(value || '')}
					onMount={handleEditorDidMount}
					theme="vs-dark"
					options={{
						minimap: { enabled: true },
						scrollBeyondLastLine: false,
						fontSize: 14,
						lineNumbers: 'on',
						roundedSelection: false,
						scrollbar: {
							vertical: 'auto',
							horizontal: 'auto',
						},
						automaticLayout: true,
						tabSize: 2,
						insertSpaces: true,
						wordWrap: 'on',
						folding: true,
						lineNumbersMinChars: 3,
						glyphMargin: false,
						renderLineHighlight: 'line',
						selectOnLineNumbers: true,
						matchBrackets: 'always',
					}}
				/>
			</div>
		</div>
	);
}
