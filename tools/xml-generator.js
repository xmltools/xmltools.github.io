// XML Generator Tool Logic
;(() => {
  const templateInput = document.getElementById("template-input")
  const xmlOutput = document.getElementById("xml-output")
  const rootNameInput = document.getElementById("root-name")
  const recordCountInput = document.getElementById("record-count")
  const generateBtn = document.getElementById("generate-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const errorMessage = document.getElementById("error-message")

  function jsonToXml(obj, indent = "  ") {
    let xml = ""
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        xml += `${indent}<${key}>\n${jsonToXml(obj[key], indent + "  ")}${indent}</${key}>\n`
      } else {
        xml += `${indent}<${key}>${obj[key]}</${key}>\n`
      }
    }
    return xml
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

  generateBtn.addEventListener("click", () => {
    const templateRaw = templateInput.value.trim()
    const rootName = rootNameInput.value.trim() || "root"
    const count = parseInt(recordCountInput.value) || 1

    try {
      const templateObj = JSON.parse(templateRaw)
      let xmlResult = `<?xml version="1.0" encoding="UTF-8"?>\n`
      xmlResult += `<${rootName}>\n`

      for (let i = 0; i < count; i++) {
        xmlResult += jsonToXml(templateObj, "  ")
      }

      xmlResult += `</${rootName}>`
      xmlOutput.value = xmlResult
      showSuccess("XML generated successfully!")
    } catch (error) {
      showError("Template Error: Please ensure you provide valid JSON.")
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!xmlOutput.value) return
    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) return
    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated_sample.xml"
    a.click()
  })
})()
