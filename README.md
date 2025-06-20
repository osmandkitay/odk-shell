# ODK - Your Ideas, Your Computer's Actions

**⚠️ Early Version Notice**: This is the first version of ODK - a basic approach to demonstrate the concept. While the code works, it runs somewhat slowly and has limitations. This is an experimental project focused on local AI models rather than API-based solutions.

## 🎯 Vision

In today's world, we interact with our computers through a series of clicks, drags, and memorized commands. We navigate through menus, search for the right application, and perform multi-step processes to achieve a single goal.

**What if we could simplify this?** What if you could just tell your computer what you want, and it would understand and act?

This is the vision behind ODK.

### A Conversation with Your Computer

ODK is not just another application; it's a new way to interact. It's a bridge between your thoughts and your computer's capabilities. It allows you to express your goals in plain, natural language, and watch as your computer brings them to life.

Think of it as a blank canvas where your words become actions. You write down what you need, and the machine handles the "how."

### What Can You Do with ODK?

Imagine transforming complex tasks into a single instruction. With ODK, you can:

**Organize Your Files Effortlessly:**
- "Find every PDF presentation I've downloaded this month, rename them to include today's date, and move them all into my 'Reports' folder."

**Automate Tedious Work:**
- "Look at this spreadsheet of contacts, find everyone from New York, and create a separate mailing list file for them."

**Boost Your Creativity:**
- "Take the last 5 images from my 'Designs' folder, resize them for social media, and place a small watermark in the bottom-right corner of each."

**Streamline Your Projects:**
- "Create a new folder for my project named 'Odyssey', set up the standard subfolders like 'src', 'assets', and 'docs', and initialize a Git repository inside it."

ODK is designed to remove the friction between having an idea and seeing it realized. It's for anyone who has ever thought, "There has to be a faster way to do this."

Our goal is to empower you to work more creatively and efficiently, turning the power of your computer into a natural extension of your own mind.

## 🏗️ Architecture & Technology

ODK is built with a focus on **local AI models** rather than relying on external APIs. This approach ensures privacy and allows you to work offline with small, efficient models.

### Core Components

```
Frontend (HTML/CSS/JS) 
    ↕️ Tauri IPC
Rust Backend 
    ↕️ Process Communication
Python AI Engine (Open Interpreter)
```

**Technology Stack:**
- **Frontend**: HTML, CSS, JavaScript with modern UI
- **Backend**: Rust with Tauri framework for cross-platform support
- **AI Engine**: Python with [Open Interpreter](https://github.com/OpenInterpreter/open-interpreter) library
- **Models**: Supports Ollama local models, OpenAI, Google Gemini, and Anthropic Claude

## 🚀 Features (Current Version)

- ✅ **Cross-Platform**: Works on Windows, macOS, and Linux
- ✅ **Local AI Support**: Automatic detection of Ollama models
- ✅ **Multiple AI Providers**: OpenAI, Google Gemini, Anthropic Claude support
- ✅ **Clean Interface**: Simple input/output design
- ✅ **Keyboard Shortcuts**: Ctrl+Enter (Cmd+Enter on Mac) to execute
- ✅ **Error Handling**: Clear error messages and loading states
- ⚠️ **Performance**: Currently runs slower than optimal (first version)

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **Rust** (1.77.2 or newer) - Run `rustup update` to get latest
- **Python 3** (3.8 or higher)
- **Tauri CLI**: `npm install -g @tauri-apps/cli`

### Installation Steps

1. **Clone and install dependencies:**
   ```bash
   git clone [your-repo-url]
   cd odk-shell
   npm install
   ```

2. **Install Open Interpreter:**
   ```bash
   pip install open-interpreter
   ```

3. **Verify Python is available:**
   ```bash
   python --version  # or python3 --version
   ```

4. **Update Rust if needed:**
   ```bash
   rustup update
   rustc --version  # Should be 1.77.2 or newer
   ```

5. **Run the development server:**
   ```bash
   npm run tauri dev
   ```

## 🧪 How to Use

### Step-by-Step Usage

1. **Launch the Application**
   ```bash
   npm run tauri dev
   ```

2. **Select an AI Provider**
   - Click "Choose AI" dropdown
   - Select from available options (Ollama models recommended for local use)

3. **Enter Your Command**
   Type natural language commands like:
   - `"List all files in my Documents folder"`
   - `"Create a backup of my project files"`
   - `"Find all Python files and show their sizes"`

4. **Execute**
   - Click "Run" button, or
   - Press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

### Example Commands to Try

```
"Show me the current directory contents"
"Create a new folder called 'test-project'"
"List all .txt files in the current directory"
"What is the current date and time?"
```

### Understanding the Output

The current version will show:
- The command you entered
- AI model being used
- Results of the execution
- Any error messages if something goes wrong

## ⚠️ Current Limitations

This is an **early version** with several limitations:

- **Performance**: Runs slower than optimal due to Python process spawning
- **Error Handling**: Basic error reporting (improvements planned)
- **Security**: Uses `auto_run=True` for demonstration (not production-ready)
- **Features**: Limited to basic command execution
- **Documentation**: Minimal documentation (expanding)

## 🔧 Development

### Project Structure

```
odk-shell/
├── src/                    # Frontend files
│   ├── index.html         # Main UI structure
│   ├── styles.css         # Modern styling
│   └── main.js            # Frontend logic
├── src-tauri/             # Rust backend
│   └── src/
│       ├── main.rs        # Entry point
│       └── lib.rs         # Commands & logic
├── runner.py              # Python AI engine
├── package.json           # Node.js dependencies
└── README.md              # This file
```

### Building for Production

```bash
npm run tauri build
```

## 🛣️ Roadmap

### ✅ Phase 1: MVP (Current)
- Basic UI and communication bridge
- Local model support (Ollama)
- Simple command execution

### 🚧 Phase 2: AI Integration (Next)
- Enhanced Open Interpreter integration
- User confirmation for commands
- Better error handling and security
- Performance optimizations

### 🔮 Phase 3: Advanced Features
- `.odk` file format for conversation history
- Enhanced security and sandboxing
- Plugin system for extensibility
- Better UI/UX improvements

## 🔒 Security Notice

**Important**: The current version is for **development and testing only**. It uses `auto_run=True` which automatically executes commands without confirmation. **Do not use in production environments** without implementing proper security measures:

- Command confirmation dialogs
- Sandboxed execution environment
- User permission management
- Input validation and filtering

## 🔗 Dependencies

- **[Open Interpreter](https://github.com/OpenInterpreter/open-interpreter)**: The core AI engine that powers ODK
- **[Tauri](https://tauri.app/)**: Cross-platform application framework
- **[Rust](https://www.rust-lang.org/)**: Backend systems programming
- **[Ollama](https://ollama.ai/)**: Local AI model management (optional)

## 🤝 Contributing

This is an experimental project. Contributions welcome for:

1. Performance improvements
2. Security enhancements  
3. Better error handling
4. Cross-platform compatibility
5. Documentation improvements

## 📄 License

MIT License - feel free to modify and distribute.

---

**Built with ❤️ using Tauri, Rust, Open Interpreter, and modern web technologies.**

*Note: This project prioritizes local AI models for privacy and offline functionality. While it supports cloud-based AI providers, the focus is on running small, efficient models locally on your machine.*
