// JSON to XML Converter Logic
;(() => {
  const jsonInput = document.getElementById("json-input")
  const xmlOutput = document.getElementById("xml-output")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const rootName = document.getElementById("root-name")
  const errorMessage = document.getElementById("error-message")

  function jsonToXml(json, rootElementName) {
    try {
      const obj = JSON.parse(json)
      const root = rootElementName || "root"

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
      xml += objectToXml(obj, root, 0)

      return xml
    } catch (error) {
      throw new Error("Invalid JSON: " + error.message)
    }
  }

  function objectToXml(obj, elementName, level) {
    const indent = "  ".repeat(level)
    const sanitizedName = sanitizeElementName(elementName)

    if (obj === null || obj === undefined) {
      return `${indent}<${sanitizedName}/>\n`
    }

    if (typeof obj !== "object") {
      const escaped = escapeXml(String(obj))
      return `${indent}<${sanitizedName}>${escaped}</${sanitizedName}>\n`
    }

    if (Array.isArray(obj)) {
      let xml = ""
      obj.forEach((item) => {
        xml += objectToXml(item, elementName, level)
      })
      return xml
    }

    // Object
    let xml = `${indent}<${sanitizedName}>\n`

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        xml += objectToXml(obj[key], key, level + 1)
      }
    }

    xml += `${indent}</${sanitizedName}>\n`
    return xml
  }

  function sanitizeElementName(name) {
    // Remove invalid XML characters and ensure it starts with a letter
    let sanitized = name.replace(/[^a-zA-Z0-9_.-]/g, "_")

    // Ensure starts with letter or underscore
    if (!/^[a-zA-Z_]/.test(sanitized)) {
      sanitized = "item_" + sanitized
    }

    return sanitized
  }

  function escapeXml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#f8d7da"
    errorMessage.style.color = "#721c24"
    errorMessage.style.borderColor = "#f5c6cb"
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
    }, 3000)
  }

  convertBtn.addEventListener("click", () => {
    const input = jsonInput.value.trim()

    if (!input) {
      showError("Please enter JSON code to convert.")
      return
    }

    const root = rootName.value.trim() || "root"

    try {
      const xml = jsonToXml(input, root)
      xmlOutput.value = xml
      showSuccess("JSON converted to XML successfully!")
    } catch (error) {
      showError(error.message)
      xmlOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    jsonInput.value = ""
    xmlOutput.value = ""
    rootName.value = "root"
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to copy. Please convert JSON first.")
      return
    }

    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to download. Please convert JSON first.")
      return
    }

    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSuccess("File downloaded!")
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      jsonInput.value = text
      showSuccess("Pasted from clipboard!")
    } catch (error) {
      showError("Failed to paste. Please paste manually.")
    }
  })
})()
