# CloudCannon File Browser

A modern file browser and code editor built with React and Monaco Editor that integrates with the CloudCannon JavaScript API v1.

## Features

- **File Browser**: Navigate through your site files with a tree-like structure
- **Code Editor**: VSCode-like editing experience with syntax highlighting for multiple languages
- **Real-time Sync**: Automatically syncs with CloudCannon's file system
- **Auto-save**: Keyboard shortcuts (Ctrl/Cmd + S) for quick saving
- **File Type Detection**: Automatic language detection based on file extensions
- **Responsive Design**: Modern, clean interface that works across different screen sizes

## Getting Started

### Prerequisites

This application is designed to run within the CloudCannon editor environment. Make sure you have:

- Access to CloudCannon editor
- The CloudCannon JavaScript API available on the window object

### Installation

1. Navigate to the project directory:
   ```bash
   cd examples/file-browser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. Create a site on CloudCannon using these files 

## Usage

### Within CloudCannon Editor

1. Load this application within the CloudCannon editor iframe
2. The app will automatically detect and connect to the CloudCannon API
3. Browse files in the left sidebar
4. Click on any file to open it in the editor
5. Make changes and save with Ctrl/Cmd + S or using the Save button

### API Integration

The application uses the CloudCannon JavaScript API v1:

```typescript
// Access the API
const api = window.CloudCannonAPI?.useVersion('v1');

// Get all files
const files = await api.files();

// Work with individual files
const file = api.file('path/to/file.md');
const content = await file.get();
await file.set(newContent);
```

## Architecture

### Components

- **App.tsx**: Main application component that orchestrates the file browser and editor
- **FileBrowser.tsx**: Tree-view file browser with folder expansion and file selection
- **CodeEditor.tsx**: Monaco Editor wrapper with save functionality and language detection
- **useCloudCannonAPI.ts**: Custom hook for managing CloudCannon API connection and state

### File Structure

```
src/
├── components/
│   ├── FileBrowser.tsx      # File tree browser component
│   └── CodeEditor.tsx       # Monaco editor component
├── hooks/
│   └── useCloudCannonAPI.ts # CloudCannon API integration hook
├── types/
│   └── cloudcannon.ts       # TypeScript definitions for CloudCannon API
├── App.tsx                  # Main application component
├── main.tsx                 # React entry point
└── index.css               # Global styles with Tailwind
```

## Supported File Types

The editor automatically detects and provides syntax highlighting for:

- **Web**: HTML, CSS, SCSS, SASS, Less, JavaScript, TypeScript, JSX, TSX
- **Data**: JSON, YAML, XML
- **Markup**: Markdown
- **Programming**: Python, Ruby, PHP, Java, C/C++, C#, Go, Rust
- **Shell**: Bash, Shell scripts
- **Database**: SQL
- **Other**: Dockerfile, R, and more

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save current file
- **Standard Monaco shortcuts**: All Monaco Editor shortcuts are available

## Error Handling

The application includes comprehensive error handling for:

- CloudCannon API connection issues
- File loading errors
- Save operation failures
- Network connectivity problems

## Development

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Monaco Editor**: Code editing (VSCode's editor)
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **Lucide React**: Icons

## Troubleshooting

### API Not Found Error

If you see "CloudCannonAPI not found", make sure:

1. You're running the app within the CloudCannon editor environment
2. The CloudCannonAPI is available on the window object
3. The v1 API is supported in your CloudCannon version

### File Loading Issues

If files aren't loading:

1. Check browser console for API errors
2. Verify file permissions in CloudCannon
3. Ensure the API has proper access to the file system

### Build Issues

If you encounter build issues:

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `npm run dev -- --force`
3. Check TypeScript errors: `npm run build`

## License

This project is part of the CloudCannon JavaScript API examples and follows the same license terms.
