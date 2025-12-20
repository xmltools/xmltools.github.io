// XML to HTML Converter Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const htmlOutput = document.getElementById("html-output")
  const htmlPreview = document.getElementById("html-preview")
  const previewSection = document.getElementById("preview-section")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function xmlToHtmlTable(xmlDoc) {
    const root = xmlDoc.documentElement
    const children = Array.from(root.children)
    
    if (children.length === 0) {
        throw new Error("XML must contain child elements to generate a table.")
    }

    // Attempt to find headers from the first child's properties
    const firstChild = children[0]
    const headers = Array.from(firstChild.children).map(node => node.nodeName)
    
    let html = `<table border="1" style="width:100%; border-collapse: collapse; font-family: sans-serif;">\n`
    html += `  <thead>\n    <tr style="background-color: #f2f2f2;">\n`
    headers.forEach(h => {
        html += `      <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">${h}</th>\n`
    })
    html += `    </tr>\n  </thead>\n  <tbody>\n`

    children.forEach(row => {
        html += `    <tr>\n`
        headers.forEach(header => {
            const cell = row.getElementsByTagName(header)[0]
            const val = cell ? cell.textContent : ""
            html += `      <td style="padding: 12px; border: 1px solid #ddd;">${val}</td>\n`
        })
        html += `    </tr>\n`
    })

    html += `  </tbody>\n</table>`
    return html
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#ffe6e6"
    errorMessage.style.color = "#ff3333"
    previewSection.style.display = "none"
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
    const xml = xmlInput.value.trim()
    if (!xml) {
      showError("Please enter XML data.")
      return
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      if (xmlDoc.querySelector("parsererror")) throw new Error("Invalid XML syntax.")

      const tableHtml = xmlToHtmlTable(xmlDoc)
      htmlOutput.value = tableHtml
      htmlPreview.innerHTML = tableHtml
      previewSection.style.display = "block"
      showSuccess("HTML table generated!")
    } catch (error) {
      showError(error.message)
      htmlOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    htmlOutput.value = ""
    previewSection.style.display = "none"
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!htmlOutput.value) return
    htmlOutput.select()
    document.execCommand("copy")
    showSuccess("HTML code copied!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!htmlOutput.value) return
    const blob = new Blob([htmlOutput.value], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data_table.html"
    a.click()
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
