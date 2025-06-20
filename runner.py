#!/usr/bin/env python3
"""
ODK Shell - Python Runner Script

Simple, reliable bridge to open-interpreter with proper error handling.
"""

import sys
import os

def main():
    try:
        # Get the AI model from command line arguments
        if len(sys.argv) < 2:
            print("Error: No AI model specified.", file=sys.stderr)
            sys.exit(1)
        
        ai_model = sys.argv[1]
        
        # Read the prompt from stdin
        prompt = sys.stdin.read().strip()
        
        if not prompt:
            print("Error: No prompt received from stdin.", file=sys.stderr)
            sys.exit(1)

        # Import and configure interpreter
        from interpreter import interpreter
        
        # Basic configuration
        interpreter.auto_run = True
        interpreter.offline = False
        
        # Set the model based on the format
        if ai_model.startswith("ollama-"):
            model_name = ai_model.replace("ollama-", "")
            interpreter.llm.model = f"ollama/{model_name}"
            interpreter.llm.api_base = "http://localhost:11434"
        else:
            # For other models, use as-is for now
            interpreter.llm.model = ai_model

        # Execute the command - simple approach
        try:
            # Use the basic chat method without streaming complications
            result = interpreter.chat(prompt, display=False, stream=False)
            
            # Handle the result - it could be a list of messages or a single response
            if isinstance(result, list):
                # Extract text content from the messages
                output_parts = []
                for item in result:
                    if isinstance(item, dict):
                        if 'content' in item and item['content']:
                            output_parts.append(str(item['content']))
                        elif 'message' in item and item['message']:
                            output_parts.append(str(item['message']))
                    elif isinstance(item, str):
                        output_parts.append(item)
                
                final_output = '\n'.join(output_parts) if output_parts else "Command executed successfully."
            elif isinstance(result, str):
                final_output = result
            else:
                final_output = "Command executed successfully."
            
            # Output the result
            print(final_output, end="")
            
        except Exception as interpreter_error:
            # If interpreter fails, provide a helpful error message
            print(f"AI execution failed: {str(interpreter_error)}", file=sys.stderr)
            sys.exit(1)
        
    except ImportError:
        print("Error: open-interpreter library not installed. Run: pip install open-interpreter", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error in Python runner: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 