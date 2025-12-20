// XML Minifier Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const xmlOutput = document.getElementById("xml-output")
  const minifyBtn = document.getElementById("minify-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const removeComments = document.getElementById("remove-comments")
  const errorMessage = document.getElementById("error-message")
  const statsPanel = document.getElementById("stats")
  const originalSize = document.getElementById("original-size")
  const minifiedSize = document.getElementById("minified-size")
  const reduction = document.getElementById("reduction")

  function minifyXML(xml, removeCommentFlag) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")

      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        throw new Error("Invalid XML: " + parseError.textContent)
      }

      // Remove comments if requested
      if (removeCommentFlag) {
        removeCommentsFromNode(xmlDoc)
      }

      const serializer = new XMLSerializer()
      let minified = serializer.serializeToString(xmlDoc)

      // Remove whitespace between tags
      minified = minified.replace(/>\s+</g, "><")

      // Remove leading/trailing whitespace
      minified = minified.trim()

      return minified
    } catch (error) {
      throw error
    }
  }

  function removeCommentsFromNode(node) {
    const children = Array.from(node.childNodes)
    children.forEach((child) => {
      if (child.nodeType === 8) {
        // Comment node
        node.removeChild(child)
      } else if (child.nodeType === 1) {
        // Element node
        removeCommentsFromNode(child)
      }
    })
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
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

  minifyBtn.addEventListener("click", () => {
    const input = xmlInput.value.trim()

    if (!input) {
      showError("Please enter XML code to minify.")
      return
    }

    try {
      const minified = minifyXML(input, removeComments.checked)
      xmlOutput.value = minified

      // Calculate and display statistics
      const originalBytes = new Blob([input]).size
      const minifiedBytes = new Blob([minified]).size
      const reductionPercent = (((originalBytes - minifiedBytes) / originalBytes) * 100).toFixed(1)

      originalSize.textContent = formatBytes(originalBytes)
      minifiedSize.textContent = formatBytes(minifiedBytes)
      reduction.textContent = reductionPercent + "%"
      statsPanel.style.display = "flex"

      showSuccess("XML minified successfully!")
    } catch (error) {
      showError(error.message)
      xmlOutput.value = ""
      statsPanel.style.display = "none"
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    xmlOutput.value = ""
    statsPanel.style.display = "none"
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to copy. Please minify XML first.")
      return
    }

    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) {
      showError("Nothing to download. Please minify XML first.")
      return
    }

    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "minified.xml"
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
