// CSV to XML Converter Tool Logic
;(() => {
  const csvInput = document.getElementById("csv-input")
  const xmlOutput = document.getElementById("xml-output")
  const rootInput = document.getElementById("root-name")
  const rowInput = document.getElementById("row-name")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function csvToXml(csv, rootName, rowName) {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== "")
    if (lines.length < 2) {
      throw new Error("Invalid CSV: Requires at least a header row and one data row.")
    }

    const headers = lines[0].split(",").map(h => h.trim().replace(/[^a-zA-Z0-9]/g, "_"))
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`

    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(",")
      xml += `  <${rowName}>\n`
      for (let j = 0; j < headers.length; j++) {
        const val = data[j] ? data[j].trim() : ""
        xml += `    <${headers[j]}>${escapeXml(val)}</${headers[j]}>\n`
      }
      xml += `  </${rowName}>\n`
    }

    xml += `</${rootName}>`
    return xml
  }

  function escapeXml(unsafe) {
    return unsafe.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });
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
    setTimeout(() => {
      errorMessage.style.display = "none"
      errorMessage.style.background = ""
      errorMessage.style.color = ""
    }, 3000)
  }

  convertBtn.addEventListener("click", () => {
    const csv = csvInput.value.trim()
    const root = rootInput.value.trim() || "root"
    const row = rowInput.value.trim() || "row"

    if (!csv) {
      showError("Please enter CSV data to convert.")
      return
    }

    try {
      const result = csvToXml(csv, root, row)
      xmlOutput.value = result
      showSuccess("CSV converted to XML successfully!")
    } catch (error) {
      showError(error.message)
      xmlOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    csvInput.value = ""
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
    a.download = "converted_data.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      csvInput.value = text
      showSuccess("CSV Pasted!")
    } catch (err) {
      showError("Paste failed. Use Ctrl+V.")
    }
  })
})()
