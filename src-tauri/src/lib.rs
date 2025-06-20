use std::process::Command;
use std::io::Write;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn run_command(prompt: String, ai_model: String) -> Result<String, String> {
    // Spawn Python process to run our runner script (located in project root)
    let script_path = "../runner.py";
    let mut child = Command::new("python3")
        .env("PYTHONIOENCODING", "utf-8")
        .arg(script_path)
        .arg(&ai_model)
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .or_else(|_| {
            // Fallback to 'python' if 'python3' is not found
            Command::new("python")
                .env("PYTHONIOENCODING", "utf-8")
                .arg(script_path)
                .arg(&ai_model)
                .stdin(std::process::Stdio::piped())
                .stdout(std::process::Stdio::piped())
                .stderr(std::process::Stdio::piped())
                .spawn()
        })
        .map_err(|e| format!("Failed to start Python process: {}", e))?;

    // Write the prompt to Python script's stdin
    if let Some(stdin) = child.stdin.as_mut() {
        stdin.write_all(prompt.as_bytes())
            .map_err(|e| format!("Failed to write to Python stdin: {}", e))?;
        stdin.flush()
            .map_err(|e| format!("Failed to flush Python stdin: {}", e))?;
    }

    // Wait for the process to complete and collect output
    let output = child.wait_with_output()
        .map_err(|e| format!("Failed to wait for Python process: {}", e))?;

    if output.status.success() {
        String::from_utf8(output.stdout)
            .map_err(|e| format!("Failed to parse Python output: {}", e))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Python script failed: {}", stderr))
    }
}

#[tauri::command]
async fn get_ollama_models() -> Result<Vec<String>, String> {
    // Try to run 'ollama list' to get available models
    let output = Command::new("ollama")
        .arg("list")
        .output()
        .map_err(|e| format!("Failed to run ollama command: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Ollama command failed: {}", stderr));
    }

    let stdout = String::from_utf8(output.stdout)
        .map_err(|e| format!("Failed to parse ollama output: {}", e))?;

    // Parse the output to extract model names
    let mut models = Vec::new();
    for line in stdout.lines() {
        // Skip header line and empty lines
        if line.starts_with("NAME") || line.trim().is_empty() {
            continue;
        }
        
        // Extract model name (first column)
        if let Some(model_name) = line.split_whitespace().next() {
            // Remove :latest suffix if present
            let clean_name = model_name.replace(":latest", "");
            if !clean_name.is_empty() {
                models.push(clean_name);
            }
        }
    }

    // Sort models alphabetically
    models.sort();
    
    Ok(models)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![run_command, get_ollama_models])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
