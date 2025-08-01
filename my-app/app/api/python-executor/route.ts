export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    // Simulate Python code execution
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Enhanced Python execution simulation
    const output = executePythonCode(code)

    return Response.json({
      success: true,
      output: output,
      execution_time: "0.123s",
      memory_usage: "2.4 MB",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Python execution failed",
        output: `Error: ${error}`,
      },
      { status: 500 },
    )
  }
}

function executePythonCode(code: string): string {
  let output = ""
  const lines = code.split("\n")

  // Enhanced execution simulation
  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith("#")) continue

    // Handle print statements
    const printMatch = trimmedLine.match(/print\s*$$\s*(.+)\s*$$/)
    if (printMatch) {
      let content = printMatch[1]

      // Handle f-strings
      if (content.startsWith('f"') || content.startsWith("f'")) {
        content = content.substring(2, content.length - 1)
        // Simple f-string processing
        content = content.replace(/\{([^}]+)\}/g, (match, expr) => {
          // Basic expression evaluation
          if (expr.includes("datetime.datetime.now()")) {
            return new Date().toISOString()
          }
          if (expr.includes("sys.version")) {
            return "3.9.0 (HLounh OS Server)"
          }
          return expr
        })
      } else if (content.startsWith('"') || content.startsWith("'")) {
        content = content.substring(1, content.length - 1)
      }

      content = content.replace(/\\n/g, "\n").replace(/\\t/g, "\t")
      output += content + "\n"
    }

    // Handle imports
    if (trimmedLine.startsWith("import ") || trimmedLine.startsWith("from ")) {
      // Simulate successful import
      continue
    }

    // Handle simple calculations
    if (trimmedLine.includes("sum(") && trimmedLine.includes("=")) {
      output += "Calculation completed\n"
    }
  }

  if (output === "") {
    output = "✅ Code executed successfully on server (no output)\n"
  }

  return output
}
