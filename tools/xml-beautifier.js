// XML Beautifier Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const xmlOutput = document.getElementById("xml-output")
  const beautifyBtn = document.getElementById("beautify-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const indentSize = document.getElementById("indent-size")
  const errorMessage = document.getElementById("error-message")

  function beautifyXML(xml, indentStr) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")

      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        throw new Error("Invalid XML: The provided string is not valid XML.")
      }

      // Basic serialization
      const serializer = new XMLSerializer()
      const rawString = serializer.serializeToString(xmlDoc)
      
      // Advanced Pretty Print Logic
      let formatted = ""
      let indent = ""
      
      // Split by tags and filter out empty strings
      const nodes = rawString.split(/>\s*</)
      
      nodes.forEach((node, index) => {
        // If the node is a closing tag
        if (node.match(/^\/\w/)) {
          indent = indent.substring(indentStr.length)
        }

        // Add indentation and node
        let line = indent + "<" + node + ">"
        
        // Handle self-closing tags or header tags <?xml...?>
        if (index === 0 && node.startsWith("?xml")) {
            formatted += line + "\r\n"
        } else {
            formatted += line + "\r\n"
        }

        // If the node is a starting tag and NOT a self-closing tag
        if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("?")) {
          indent += indentStr
        }
      })

      // Clean up start/end brackets and return
      return formatted.replace(/<{2,}/g, '<').replace(/>{2,}/g, '>').trim()
      
    } catch (error) {
      throw error
    }
  }

  function getIndentString() {
    const value = indentSize.value
    if (value === "tab") return "\t"
    return " ".repeat(Number.parseInt(value))
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#ffe6e6"
    errorMessage.style.color = "#ff3333"
    setTimeout(() => {
      errorMessage.style.display = "none"
    }, 5000)
  }

  function showSuccess(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#d4edda"
    errorMessage.style.color = "#155724"
    errorMessage.style.borderColor = "#c3e6cb"
    setTimeout(() => {
      errorMessage.style.display = "none"
      errorMessage.style.background = ""
      errorMessage.style.color = ""
      errorMessage.style.borderColor = ""
    }, 3000)
  }

  beautifyBtn.addEventListener("click", () => {
    const input = xmlInput.value.trim()

    if (!input) {
      showError("Please enter XML code to beautify.")
      return
    }

    try {
      const result = beautifyXML(input, getIndentString())
      xmlOutput.value = result
      showSuccess("XML beautified successfully!")
    } catch (error) {
      showError(error.message)
      xmlOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    xmlOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to copy.")
      return
    }
    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to download.")
      return
    }
    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "beautified.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      xmlInput.value = text
      showSuccess("Pasted!")
    } catch (err) {
      showError("Paste failed. Use Ctrl+V.")
    }
  })
})()
