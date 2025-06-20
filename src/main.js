const { invoke } = window.__TAURI__.core;

let promptInputEl;
let outputAreaEl;
let runButtonEl;
let aiSelectEl;
let selectedAI = ""; // No default selection - user must choose

async function runCommand() {
  const prompt = promptInputEl.value.trim();
  
  if (!prompt) {
    displayOutput("Please enter a prompt before running.", "error");
    return;
  }

  if (!selectedAI) {
    displayOutput("⚠️ Please select an AI provider first from the dropdown above.", "error");
    aiSelectEl.focus();
    return;
  }

  // Disable button and show loading state
  runButtonEl.disabled = true;
  runButtonEl.textContent = "Running...";
  runButtonEl.classList.add("loading");
  
  // Clear previous output and show loading message
  displayOutput(`Executing command with ${getAIDisplayName(selectedAI)}...`, "info");

  try {
    // Call the Rust backend command with both prompt and AI model selection
    const result = await invoke("run_command", { 
      prompt: prompt,
      aiModel: selectedAI 
    });
    
    // Display the result directly (AI model info will be handled by the backend)
    displayOutput(result, "success");
  } catch (error) {
    console.error("Error executing command:", error);
    displayOutput(`Error: ${error}`, "error");
  } finally {
    // Re-enable button and remove loading state
    runButtonEl.disabled = false;
    runButtonEl.textContent = "Run";
    runButtonEl.classList.remove("loading");
  }
}

function getAIDisplayName(aiValue) {
  const aiNames = {
    // Ollama models (will be populated dynamically)
    "loading-ollama": "Loading Ollama models...",
    
    // OpenAI models
    "openai-gpt4": "GPT-4 (OpenAI)",
    "openai-gpt4-turbo": "GPT-4 Turbo (OpenAI)",
    "openai-gpt35-turbo": "GPT-3.5 Turbo (OpenAI)",
    "openai-custom": "Custom OpenAI Model",
    
    // Google Gemini models
    "gemini-pro": "Gemini Pro",
    "gemini-pro-vision": "Gemini Pro Vision",
    "gemini-custom": "Custom Gemini Model",
    
    // Anthropic Claude models
    "claude-3-opus": "Claude 3 Opus",
    "claude-3-sonnet": "Claude 3 Sonnet",
    "claude-3-haiku": "Claude 3 Haiku",
    "claude-custom": "Custom Claude Model",
    
    // Custom models
    "custom-api": "Custom API Endpoint",
    "local-model": "Local Model"
  };
  
  // Handle dynamic Ollama models
  if (aiValue.startsWith("ollama-")) {
    const modelName = aiValue.replace("ollama-", "");
    return `${modelName} (Ollama)`;
  }
  
  return aiNames[aiValue] || aiValue;
}

function handleAISelection() {
  selectedAI = aiSelectEl.value;
  
  if (!selectedAI) {
    return; // No selection made
  }
  
  if (selectedAI === "loading-ollama") {
    // Prevent selection of loading option
    aiSelectEl.value = "";
    selectedAI = "";
    return;
  }
  
  // Show confirmation of AI selection
  const aiDisplayName = getAIDisplayName(selectedAI);
  displayOutput(`✅ ${aiDisplayName} selected. Ready for commands!`, "success");
  
  // Clear after 3 seconds to show placeholder again
  setTimeout(() => {
    if (outputAreaEl.querySelector(".output-content")) {
      outputAreaEl.innerHTML = '<p class="placeholder">Results will appear here...</p>';
    }
  }, 3000);
}

async function loadOllamaModels() {
  try {
    // Call backend to get Ollama models
    const models = await invoke("get_ollama_models");
    const ollamaGroup = document.getElementById("ollama-group");
    
    // Clear loading option
    ollamaGroup.innerHTML = "";
    
    if (models && models.length > 0) {
      models.forEach(model => {
        const option = document.createElement("option");
        option.value = `ollama-${model}`;
        option.textContent = model;
        ollamaGroup.appendChild(option);
      });
    } else {
      // No models found
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No Ollama models found";
      option.disabled = true;
      ollamaGroup.appendChild(option);
    }
  } catch (error) {
    console.error("Failed to load Ollama models:", error);
    
    // Show error in optgroup
    const ollamaGroup = document.getElementById("ollama-group");
    ollamaGroup.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Ollama not available";
    option.disabled = true;
    ollamaGroup.appendChild(option);
  }
}

function displayOutput(content, type = "normal") {
  // Remove placeholder if it exists
  const placeholder = outputAreaEl.querySelector(".placeholder");
  if (placeholder) {
    placeholder.remove();
  }

  // Create output content element
  const outputContent = document.createElement("div");
  outputContent.className = `output-content ${type}`;
  outputContent.textContent = content;
  
  // Clear previous content and add new output
  outputAreaEl.innerHTML = "";
  outputAreaEl.appendChild(outputContent);
  
  // Scroll to bottom
  outputAreaEl.scrollTop = outputAreaEl.scrollHeight;
}

function handleKeyPress(event) {
  // Allow Ctrl+Enter (or Cmd+Enter on Mac) to trigger run command
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCommand();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  promptInputEl = document.querySelector("#prompt-input");
  outputAreaEl = document.querySelector("#output-area");
  runButtonEl = document.querySelector("#run-button");
  aiSelectEl = document.querySelector("#ai-select");

  // Set up event listeners
  runButtonEl.addEventListener("click", runCommand);
  promptInputEl.addEventListener("keydown", handleKeyPress);
  aiSelectEl.addEventListener("change", handleAISelection);
  
  // Initialize - no default selection
  selectedAI = "";
  
  // Focus on input area when the app loads
  promptInputEl.focus();
  
  // Load Ollama models asynchronously
  loadOllamaModels();
  
  // Show initial message
  displayOutput("💡 Please select an AI provider from the dropdown above to get started.", "info");
  setTimeout(() => {
    outputAreaEl.innerHTML = '<p class="placeholder">Results will appear here...</p>';
  }, 4000);
});
