// XML Sorter Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const xmlOutput = document.getElementById("xml-output")
  const sortType = document.getElementById("sort-type")
  const sortBtn = document.getElementById("sort-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function sortXmlNode(node, type) {
    // 1. Sort Attributes if requested
    if ((type === 'attributes' || type === 'both') && node.attributes && node.attributes.length > 1) {
      const attrs = Array.from(node.attributes).sort((a, b) => a.name.localeCompare(b.name))
      attrs.forEach(attr => {
        node.removeAttribute(attr.name)
        node.setAttribute(attr.name, attr.value)
      })
    }

    // 2. Sort Child Elements if requested
    if ((type === 'elements' || type === 'both') && node.children.length > 1) {
      const children = Array.from(node.children).sort((a, b) => a.tagName.localeCompare(b.tagName))
      children.forEach(child => node.appendChild(child))
    }

    // 3. Recurse
    Array.from(node.children).forEach(child => sortXmlNode(child, type))
  }

  function formatXML(xml) {
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

  sortBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    const type = sortType.value

    if (!xml) {
      showError("Please enter XML to sort.")
      return
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      if (xmlDoc.querySelector("parsererror")) throw new Error("Invalid XML syntax.")

      sortXmlNode(xmlDoc.documentElement, type)

      const serializer = new XMLSerializer()
      const sortedXml = serializer.serializeToString(xmlDoc)
      xmlOutput.value = formatXML(sortedXml)
      showSuccess("XML sorted successfully!")
    } catch (error) {
      showError(error.message)
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    xmlOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!xmlOutput.value) return
    xmlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!xmlOutput.value) return
    const blob = new Blob([xmlOutput.value], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sorted.xml"
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
