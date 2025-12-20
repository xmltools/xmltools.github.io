// XML Formatter Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const xmlOutput = document.getElementById("xml-output")
  const formatBtn = document.getElementById("format-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const indentSize = document.getElementById("indent-size")
  const errorMessage = document.getElementById("error-message")

  function formatXML(xml, indent) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")

      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        throw new Error("Invalid XML: " + parseError.textContent)
      }

      // Serialize with formatting
      const serializer = new XMLSerializer()
      let formatted = serializer.serializeToString(xmlDoc)

      // Apply indentation
      formatted = beautifyXML(formatted, indent)

      return formatted
    } catch (error) {
      throw error
    }
  }

  function beautifyXML(xml, indentStr) {
    let formatted = ""
    let indent = ""

    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(indentStr.length)
      }

      formatted += indent + "<" + node + ">\r\n"

      if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("?")) {
        indent += indentStr
      }
    })

    return formatted.substring(1, formatted.length - 3)
  }

  function getIndentString() {
    const value = indentSize.value
    if (value === "tab") return "\t"
    return " ".repeat(Number.parseInt(value))
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
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

  formatBtn.addEventListener("click", () => {
    const input = xmlInput.value.trim()

    if (!input) {
      showError("Please enter XML code to format.")
      return
    }

    try {
      const formatted = formatXML(input, getIndentString())
      xmlOutput.value = formatted
      showSuccess("XML formatted successfully!")
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
      showError("Nothing to copy. Please format XML first.")
      return
    }

    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to download. Please format XML first.")
      return
    }

    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSuccess("File downloaded!")
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      xmlInput.value = text
      showSuccess("Pasted from clipboard!")
    } catch (error) {
      showError("Failed to paste. Please paste manually.")
    }
  })
})()
