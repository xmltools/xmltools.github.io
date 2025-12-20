// XML Editor Tool Logic
;(() => {
  const editor = document.getElementById("xml-editor")
  const formatBtn = document.getElementById("format-btn")
  const validateBtn = document.getElementById("validate-btn")
  const downloadBtn = document.getElementById("download-btn")
  const clearBtn = document.getElementById("clear-btn")
  const statusIndicator = document.getElementById("status-indicator")
  const errorMessage = document.getElementById("error-message")

  // Load saved content from local storage
  const savedContent = localStorage.getItem("xml_editor_content")
  if (savedContent) {
    editor.value = savedContent
  }

  function validateXML(xml) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, "text/xml")
    const error = xmlDoc.querySelector("parsererror")
    
    if (error) {
      return { valid: false, message: error.textContent.split('\n')[0] }
    }
    return { valid: true }
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#ffe6e6"
    errorMessage.style.color = "#ff3333"
    statusIndicator.textContent = "Error"
    statusIndicator.style.color = "#ff3333"
  }

  function showSuccess(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#d4edda"
    errorMessage.style.color = "#155724"
    statusIndicator.textContent = "Valid"
    statusIndicator.style.color = "#00cc66"
    setTimeout(() => {
      errorMessage.style.display = "none"
    }, 3000)
  }

  // Auto-save and live validation
  editor.addEventListener("input", () => {
    localStorage.setItem("xml_editor_content", editor.value)
    const result = validateXML(editor.value)
    if (result.valid) {
      statusIndicator.textContent = "Well-formed"
      statusIndicator.style.color = "#00cc66"
      errorMessage.style.display = "none"
    } else {
      statusIndicator.textContent = "Invalid Structure"
      statusIndicator.style.color = "#ff3333"
    }
  })

  validateBtn.addEventListener("click", () => {
    const xml = editor.value.trim()
    if (!xml) return
    
    const result = validateXML(xml)
    if (result.valid) {
      showSuccess("Success: XML is well-formed.")
    } else {
      showError(result.message)
    }
  })

  formatBtn.addEventListener("click", () => {
    const xml = editor.value.trim()
    if (!xml) return

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      if (xmlDoc.querySelector("parsererror")) throw new Error("Fix syntax errors before formatting.")

      const serializer = new XMLSerializer()
      let formatted = serializer.serializeToString(xmlDoc)
      
      // Simple regex-based beautifier for the editor
      let reg = /(>)(<)(\/*)/g
      let wspace = formatted.replace(reg, '$1\r\n$2$3')
      let formattedXml = ''
      let pad = 0
      wspace.split('\r\n').forEach((node) => {
        let indent = 0
        if (node.match(/.+<\/\w[^>]*>$/)) indent = 0
        else if (node.match(/^<\/\w/)) { if (pad != 0) pad -= 1 }
        else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1
        else indent = 0

        formattedXml += '  '.repeat(pad) + node + '\r\n'
        pad += indent
      })

      editor.value = formattedXml.trim()
      showSuccess("Formatted successfully!")
    } catch (error) {
      showError(error.message)
    }
  })

  downloadBtn.addEventListener("click", () => {
    const xml = editor.value
    if (!xml) return
    const blob = new Blob([xml], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.xml"
    a.click()
  })

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear all content?")) {
      editor.value = ""
      localStorage.removeItem("xml_editor_content")
      statusIndicator.textContent = "Ready"
    }
  })
})()
