// YAML to XML Converter Tool Logic
;(() => {
  const yamlInput = document.getElementById("yaml-input")
  const xmlOutput = document.getElementById("xml-output")
  const rootInput = document.getElementById("root-element")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  // Simple YAML to Object parser for basic structures
  function parseYaml(yaml) {
    const lines = yaml.split('\n')
    const result = {}
    const stack = [result]
    const indents = [-1]

    lines.forEach(line => {
      if (!line.trim() || line.trim().startsWith('#')) return

      const match = line.match(/^(\s*)([^:]+):\s*(.*)$/)
      if (!match) return

      const indent = match[1].length
      const key = match[2].trim()
      const value = match[3].trim()

      while (indent <= indents[indents.length - 1]) {
        stack.pop()
        indents.pop()
      }

      const currentObj = stack[stack.length - 1]
      
      if (value) {
        currentObj[key] = value
      } else {
        currentObj[key] = {}
        stack.push(currentObj[key])
        indents.push(indent)
      }
    })
    return result
  }

  function objToXml(obj, indent = "  ") {
    let xml = ""
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        xml += `${indent}<${key}>\n${objToXml(obj[key], indent + "  ")}${indent}</${key}>\n`
      } else {
        xml += `${indent}<${key}>${escapeXml(obj[key])}</${key}>\n`
      }
    }
    return xml
  }

  function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') unsafe = String(unsafe)
    return unsafe.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#ffe6e6"
    errorMessage.style.color = "#ff3333"
    setTimeout(() => { errorMessage.style.display = "none" }, 5000)
  }

  function showSuccess(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#d4edda"
    errorMessage.style.color = "#155724"
    setTimeout(() => {
      errorMessage.style.display = "none"
      errorMessage.style.background = ""
      errorMessage.style.color = ""
    }, 3000)
  }

  convertBtn.addEventListener("click", () => {
    const yaml = yamlInput.value.trim()
    const root = rootInput.value.trim() || "root"

    if (!yaml) {
      showError("Please enter YAML data to convert.")
      return
    }

    try {
      const dataObj = parseYaml(yaml)
      let xmlResult = `<?xml version="1.0" encoding="UTF-8"?>\n`
      xmlResult += `<${root}>\n`
      xmlResult += objToXml(dataObj)
      xmlResult += `</${root}>`
      
      xmlOutput.value = xmlResult
      showSuccess("Converted to XML successfully!")
    } catch (error) {
      showError("Conversion Error: " + error.message)
    }
  })

  clearBtn.addEventListener("click", () => {
    yamlInput.value = ""
    xmlOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!xmlOutput.value) return
    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) return
    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.xml"
    a.click()
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      yamlInput.value = text
      showSuccess("Pasted!")
    } catch (err) {
      showError("Paste failed.")
    }
  })
})()
