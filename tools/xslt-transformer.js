// XSLT Transformer Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const xsltInput = document.getElementById("xslt-input")
  const outputArea = document.getElementById("transformation-output")
  const transformBtn = document.getElementById("transform-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteXmlBtn = document.getElementById("paste-xml-btn")
  const pasteXsltBtn = document.getElementById("paste-xslt-btn")
  const errorMessage = document.getElementById("error-message")

  function performTransformation(xmlStr, xsltStr) {
    const parser = new DOMParser()
    
    const xmlDoc = parser.parseFromString(xmlStr, "text/xml")
    const xsltDoc = parser.parseFromString(xsltStr, "text/xml")

    // Check for parsing errors
    const xmlError = xmlDoc.querySelector("parsererror")
    const xsltError = xsltDoc.querySelector("parsererror")
    
    if (xmlError) throw new Error("XML Error: " + xmlError.textContent)
    if (xsltError) throw new Error("XSLT Error: " + xsltError.textContent)

    const processor = new XSLTProcessor()
    processor.importStylesheet(xsltDoc)

    const resultDoc = processor.transformToDocument(xmlDoc)
    
    if (!resultDoc) {
        throw new Error("Transformation failed. Please check your XSLT logic.")
    }

    const serializer = new XMLSerializer()
    return serializer.serializeToString(resultDoc)
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#ffe6e6"
    errorMessage.style.color = "#ff3333"
    setTimeout(() => {
      errorMessage.style.display = "none"
    }, 6000)
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

  transformBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    const xslt = xsltInput.value.trim()

    if (!xml || !xslt) {
      showError("Please provide both Source XML and an XSLT Stylesheet.")
      return
    }

    try {
      const result = performTransformation(xml, xslt)
      outputArea.value = result
      showSuccess("Transformation complete!")
    } catch (error) {
      showError(error.message)
      outputArea.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    xsltInput.value = ""
    outputArea.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!outputArea.value) {
      showError("Nothing to copy.")
      return
    }
    outputArea.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!outputArea.value) {
        showError("Nothing to download.")
        return
    }
    const blob = new Blob([outputArea.value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transformed_output.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })

  const setupPaste = (btn, target) => {
    btn.addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText()
        target.value = text
        showSuccess("Pasted!")
      } catch (err) {
        showError("Paste failed. Use Ctrl+V.")
      }
    })
  }

  setupPaste(pasteXmlBtn, xmlInput)
  setupPaste(pasteXsltBtn, xsltInput)
})()
