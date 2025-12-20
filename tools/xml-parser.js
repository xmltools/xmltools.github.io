// XML Parser Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const jsonOutput = document.getElementById("json-output")
  const parseBtn = document.getElementById("parse-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  /**
   * Recursively parses an XML node into a structured object
   * @param {Node} node 
   */
  function parseNode(node) {
    let result = {
      name: node.nodeName,
      type: getNodeTypeName(node.nodeType)
    }

    // Capture attributes
    if (node.attributes && node.attributes.length > 0) {
      result.attributes = {}
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i]
        result.attributes[attr.nodeName] = attr.nodeValue
      }
    }

    // Capture children or value
    if (node.hasChildNodes()) {
      result.children = []
      node.childNodes.forEach(child => {
        const childParsed = parseNode(child)
        // Skip empty text nodes (pure whitespace)
        if (child.nodeType === 3 && !child.nodeValue.trim()) return
        result.children.push(childParsed)
      })
      
      // If no children were added (all were whitespace), remove key
      if (result.children.length === 0) delete result.children
    }

    if (node.nodeType === 3 || node.nodeType === 4) { // Text or CDATA
      result.value = node.nodeValue.trim()
    }

    return result
  }

  function getNodeTypeName(type) {
    const types = {
      1: "Element",
      2: "Attribute",
      3: "Text",
      4: "CDATA",
      7: "ProcessingInstruction",
      8: "Comment",
      9: "Document"
    }
    return types[type] || "Unknown"
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

  parseBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    if (!xml) {
      showError("Please enter XML code to parse.")
      return
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      const parseError = xmlDoc.querySelector("parsererror")
      
      if (parseError) throw new Error("Invalid XML: " + parseError.textContent)

      const parsedResult = parseNode(xmlDoc.documentElement)
      jsonOutput.value = JSON.stringify(parsedResult, null, 2)
      showSuccess("XML parsed successfully!")
    } catch (error) {
      showError(error.message)
      jsonOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    jsonOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!jsonOutput.value) return
    jsonOutput.select()
    document.execCommand("copy")
    showSuccess("JSON copied!")
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      xmlInput.value = text
    } catch (err) {
      showError("Paste failed.")
    }
  })
})()
