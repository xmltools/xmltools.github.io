// XML Splitter Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const splitElementInput = document.getElementById("split-element")
  const chunksContainer = document.getElementById("chunks-container")
  const splitBtn = document.getElementById("split-btn")
  const clearBtn = document.getElementById("clear-btn")
  const pasteBtn = document.getElementById("paste-btn")
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

  function createDownloadLink(content, index) {
    const blob = new Blob([content], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    
    const wrapper = document.createElement("div")
    wrapper.style.display = "flex"
    wrapper.style.justifyContent = "space-between"
    wrapper.style.alignItems = "center"
    wrapper.style.padding = "10px"
    wrapper.style.borderBottom = "2px solid var(--black)"
    wrapper.style.marginBottom = "5px"

    const name = document.createElement("span")
    name.textContent = `part_${index + 1}.xml`
    name.style.fontWeight = "bold"

    const link = document.createElement("a")
    link.href = url
    link.download = `part_${index + 1}.xml`
    link.textContent = "Download"
    link.className = "btn-small"
    link.style.textDecoration = "none"
    link.style.backgroundColor = "var(--green)"
    link.style.color = "white"

    wrapper.appendChild(name)
    wrapper.appendChild(link)
    return wrapper
  }

  splitBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    const tagName = splitElementInput.value.trim()

    if (!xml || !tagName) {
      showError("Please provide both XML data and the element name to split by.")
      return
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      const parseError = xmlDoc.querySelector("parsererror")
      
      if (parseError) throw new Error("Invalid XML structure.")

      const nodes = xmlDoc.getElementsByTagName(tagName)
      if (nodes.length === 0) throw new Error(`No elements found with tag name: <${tagName}>`)

      chunksContainer.innerHTML = ""
      const serializer = new XMLSerializer()

      for (let i = 0; i < nodes.length; i++) {
        // Create a new valid XML document for each chunk
        let chunkXml = `<?xml version="1.0" encoding="UTF-8"?>\n`
        chunkXml += serializer.serializeToString(nodes[i])
        
        const linkElement = createDownloadLink(chunkXml, i)
        chunksContainer.appendChild(linkElement)
      }

      showSuccess(`Successfully split into ${nodes.length} files!`)
    } catch (error) {
      showError(error.message)
      chunksContainer.innerHTML = '<span style="color: var(--gray-medium);">Error processing split.</span>'
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    splitElementInput.value = ""
    chunksContainer.innerHTML = '<span style="color: var(--gray-medium);">Split results will appear here as a list of files...</span>'
    errorMessage.style.display = "none"
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
