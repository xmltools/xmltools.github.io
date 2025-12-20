// XML to CSV Converter Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const csvOutput = document.getElementById("csv-output")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const delimiter = document.getElementById("delimiter")
  const includeHeaders = document.getElementById("include-headers")
  const errorMessage = document.getElementById("error-message")

  function xmlToCSV(xml, delim, headers) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, "text/xml")

    const parseError = xmlDoc.querySelector("parsererror")
    if (parseError) {
      throw new Error("Invalid XML: " + parseError.textContent)
    }

    // Find repeating elements (assume they're rows)
    const root = xmlDoc.documentElement
    const rows = []
    const columnSet = new Set()

    // Get all child elements of root
    const children = Array.from(root.children)

    if (children.length === 0) {
      throw new Error("No data elements found in XML")
    }

    // Collect all columns and row data
    children.forEach((child) => {
      const row = {}
      extractData(child, "", row, columnSet)
      rows.push(row)
    })

    // Convert Set to Array for consistent ordering
    const columns = Array.from(columnSet)

    // Build CSV
    let csv = ""

    // Add headers if requested
    if (headers) {
      csv += columns.map((col) => escapeCSV(col, delim)).join(delim) + "\n"
    }

    // Add data rows
    rows.forEach((row) => {
      const values = columns.map((col) => escapeCSV(row[col] || "", delim))
      csv += values.join(delim) + "\n"
    })

    return csv
  }

  function extractData(element, prefix, row, columnSet) {
    // Add attributes
    if (element.attributes.length > 0) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        const key = prefix + "@" + attr.name
        row[key] = attr.value
        columnSet.add(key)
      }
    }

    // Check if element has only text content
    const hasOnlyText = Array.from(element.childNodes).filter((node) => node.nodeType === 1).length === 0

    if (hasOnlyText) {
      const key = prefix + element.nodeName
      row[key] = element.textContent.trim()
      columnSet.add(key)
    } else {
      // Has child elements
      Array.from(element.children).forEach((child) => {
        const newPrefix = prefix ? prefix + "." + element.nodeName + "." : element.nodeName + "."
        extractData(child, newPrefix, row, columnSet)
      })
    }
  }

  function escapeCSV(value, delim) {
    value = String(value)

    // If value contains delimiter, quotes, or newlines, wrap in quotes
    if (value.includes(delim) || value.includes('"') || value.includes("\n") || value.includes("\r")) {
      // Escape quotes by doubling them
      value = value.replace(/"/g, '""')
      return '"' + value + '"'
    }

    return value
  }

  function getDelimiter() {
    const value = delimiter.value
    if (value === "\\t") return "\t"
    return value
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
      const csv = xmlToCSV(input, getDelimiter(), includeHeaders.checked)
      csvOutput.value = csv
      showSuccess("XML converted to CSV successfully!")
    } catch (error) {
      showError(error.message)
      csvOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    csvOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!csvOutput.value) {
      showError("Nothing to copy. Please convert XML first.")
      return
    }

    csvOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!csvOutput.value) {
      showError("Nothing to download. Please convert XML first.")
      return
    }

    const blob = new Blob([csvOutput.value], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.csv"
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
