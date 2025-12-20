// XML to JSON Converter Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const jsonOutput = document.getElementById("json-output")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const compactMode = document.getElementById("compact-mode")
  const errorMessage = document.getElementById("error-message")

  function xmlToJson(xml) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, "text/xml")

    // Check for parsing errors
    const parseError = xmlDoc.querySelector("parsererror")
    if (parseError) {
      throw new Error("Invalid XML: " + parseError.textContent)
    }

    return elementToJson(xmlDoc.documentElement)
  }

  function elementToJson(element) {
    const obj = {}

    // Handle attributes
    if (element.attributes.length > 0) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        obj["@" + attr.name] = attr.value
      }
    }

    // Handle child nodes
    const children = element.childNodes
    let hasElementChild = false
    let textContent = ""

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      if (child.nodeType === 1) {
        // Element node
        hasElementChild = true
        const childName = child.nodeName
        const childJson = elementToJson(child)

        if (obj[childName]) {
          if (!Array.isArray(obj[childName])) {
            obj[childName] = [obj[childName]]
          }
          obj[childName].push(childJson)
        } else {
          obj[childName] = childJson
        }
      } else if (child.nodeType === 3) {
        // Text node
        textContent += child.nodeValue.trim()
      } else if (child.nodeType === 4) {
        // CDATA section
        textContent += child.nodeValue
      }
    }

    // If no element children, add text content
    if (!hasElementChild && textContent) {
      if (Object.keys(obj).length === 0) {
        return textContent
      } else {
        obj["#text"] = textContent
      }
    }

    // If empty element
    if (Object.keys(obj).length === 0) {
      return null
    }

    return obj
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
    const input = xmlInput.value.trim()

    if (!input) {
      showError("Please enter XML code to convert.")
      return
    }

    try {
      const jsonObj = xmlToJson(input)
      const indent = compactMode.checked ? 0 : 2
      const jsonStr = JSON.stringify(jsonObj, null, indent)
      jsonOutput.value = jsonStr
      showSuccess("XML converted to JSON successfully!")
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
    if (!jsonOutput.value) {
      showError("Nothing to copy. Please convert XML first.")
      return
    }

    jsonOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!jsonOutput.value) {
      showError("Nothing to download. Please convert XML first.")
      return
    }

    const blob = new Blob([jsonOutput.value], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.json"
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
