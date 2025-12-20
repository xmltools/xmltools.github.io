// XML Merger Tool Logic
;(() => {
  const xmlInput1 = document.getElementById("xml-input-1")
  const xmlInput2 = document.getElementById("xml-input-2")
  const xmlOutput = document.getElementById("xml-output")
  const mergeRootInput = document.getElementById("merge-root")
  const mergeBtn = document.getElementById("merge-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const errorMessage = document.getElementById("error-message")

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
    }, 3000)
  }

  function beautifyXML(xml) {
    const PADDING = '  '
    let formatted = ''
    let pad = 0
    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) pad -= 1
      formatted += PADDING.repeat(pad) + '<' + node + '>\r\n'
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) pad += 1
    })
    return formatted.trim()
  }

  mergeBtn.addEventListener("click", () => {
    const xml1 = xmlInput1.value.trim()
    const xml2 = xmlInput2.value.trim()
    const rootTag = mergeRootInput.value.trim() || "merged_root"

    if (!xml1 || !xml2) {
      showError("Please provide both XML documents to merge.")
      return
    }

    try {
      const parser = new DOMParser()
      const doc1 = parser.parseFromString(xml1, "text/xml")
      const doc2 = parser.parseFromString(xml2, "text/xml")

      if (doc1.querySelector("parsererror") || doc2.querySelector("parsererror")) {
        throw new Error("One or both XML sources are invalid.")
      }

      // Create a new document for the result
      const resultDoc = document.implementation.createDocument(null, rootTag)
      const root = resultDoc.documentElement

      // Import and append the first document root
      const importedNode1 = resultDoc.importNode(doc1.documentElement, true)
      root.appendChild(importedNode1)

      // Import and append the second document root
      const importedNode2 = resultDoc.importNode(doc2.documentElement, true)
      root.appendChild(importedNode2)

      const serializer = new XMLSerializer()
      const mergedXml = serializer.serializeToString(resultDoc)
      xmlOutput.value = beautifyXML(mergedXml)
      
      showSuccess("Documents merged successfully!")
    } catch (error) {
      showError(error.message)
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput1.value = ""
    xmlInput2.value = ""
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
    a.download = "merged_result.xml"
    a.click()
  })
})()
