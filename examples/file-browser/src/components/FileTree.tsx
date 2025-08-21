import type { CloudCannonJavaScriptV1APIFile } from '@cloudcannon/javascript-api';
import { ChevronDown, ChevronRight, File, Folder, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

interface FileTreeProps {
	files: CloudCannonJavaScriptV1APIFile[];
	selectedFile: CloudCannonJavaScriptV1APIFile | null;
	onFileSelect: (file: CloudCannonJavaScriptV1APIFile) => void;
	isLoading: boolean;
}

interface FileTreeNode {
	name: string;
	path: string;
	type: 'file' | 'directory';
	children?: Record<string, FileTreeNode>;
	file?: CloudCannonJavaScriptV1APIFile;
}

function buildFileTree(files: CloudCannonJavaScriptV1APIFile[]): FileTreeNode[] {
	const root: Record<string, FileTreeNode> = {};

	files.forEach((file) => {
		const parts = file.path.split('/').filter(Boolean);
		let current = root;

		parts.forEach((part, index) => {
			const isFile = index === parts.length - 1;
			const currentPath = parts.slice(0, index + 1).join('/');

			if (!current[part]) {
				current[part] = {
					name: part,
					path: currentPath,
					type: isFile ? 'file' : 'directory',
					children: isFile ? undefined : {},
					file: isFile ? file : undefined,
				};
			}

			if (!isFile) {
				current = current[part].children as Record<string, FileTreeNode>;
			}
		});
	});

	// Convert to array and sort
	const sortNodes = (nodes: Record<string, FileTreeNode>): FileTreeNode[] => {
		return Object.values(nodes)
			.map((node) => ({
				...node,
				children: node.children ? sortNodes(node.children) : {},
			}))
			.sort((a, b) => {
				// Directories first, then files
				if (a.type !== b.type) {
					return a.type === 'directory' ? -1 : 1;
				}
				return a.name.localeCompare(b.name);
			});
	};

	return sortNodes(root);
}

interface FileTreeItemProps {
	node: FileTreeNode;
	selectedFile: CloudCannonJavaScriptV1APIFile | null;
	onFileSelect: (file: CloudCannonJavaScriptV1APIFile) => void;
	level: number;
}

function FileTreeItem({ node, selectedFile, onFileSelect, level }: FileTreeItemProps) {
	const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first two levels
	const isSelected = selectedFile?.path === node.path;

	const handleClick = () => {
		if (node.type === 'directory') {
			setIsExpanded(!isExpanded);
		} else if (node.file) {
			onFileSelect(node.file);
		}
	};

	const getFileIcon = (_filename: string) => {
		// const ext = filename.split('.').pop()?.toLowerCase();
		// You could expand this with more specific file type icons
		return <File size={16} />;
	};

	return (
		<div>
			<div
				className={`
          flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 
          ${isSelected ? 'bg-blue-100 border-r-2 border-blue-500' : ''}
        `}
				style={{ paddingLeft: `${level * 16 + 8}px` }}
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						handleClick();
					}
				}}
			>
				{node.type === 'directory' && (
					<span className="mr-1 text-gray-400">
						{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
					</span>
				)}

				<span className="mr-2 text-gray-600">
					{node.type === 'directory' ? <Folder size={16} /> : getFileIcon(node.name)}
				</span>

				<span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
					{node.name}
				</span>
			</div>

			{node.type === 'directory' && isExpanded && node.children && (
				<div>
					{Object.values(node.children).map((child) => (
						<FileTreeItem
							key={child.path}
							node={child}
							selectedFile={selectedFile}
							onFileSelect={onFileSelect}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export function FileTree({ files, selectedFile, onFileSelect, isLoading }: FileTreeProps) {
	const fileTree = useMemo(() => buildFileTree(files), [files]);

	return (
		<div className="flex-1 overflow-auto">
			{isLoading ? (
				<div className="p-4 text-center text-gray-500">
					<RefreshCw size={20} className="animate-spin mx-auto mb-2" />
					<p className="text-sm">Loading files...</p>
				</div>
			) : fileTree.length === 0 ? (
				<div className="p-4 text-center text-gray-500">
					<p className="text-sm">No files found</p>
				</div>
			) : (
				<div className="py-2">
					{fileTree.map((node) => (
						<FileTreeItem
							key={node.path}
							node={node}
							selectedFile={selectedFile}
							onFileSelect={onFileSelect}
							level={0}
						/>
					))}
				</div>
			)}
		</div>
	);
}
