// XML Viewer Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const viewerOutput = document.getElementById("viewer-output")
  const viewBtn = document.getElementById("view-btn")
  const clearBtn = document.getElementById("clear-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function createTreeNode(node) {
    if (node.nodeType === 3) { // Text Node
      const text = node.nodeValue.trim()
      if (!text) return null
      const span = document.createElement("span")
      span.className = "xml-val"
      span.textContent = text
      return span
    }

    if (node.nodeType === 1) { // Element Node
      const container = document.createElement("div")
      container.className = "xml-node"

      const tagHeader = document.createElement("div")
      tagHeader.className = "xml-tag-wrapper"

      const toggle = document.createElement("span")
      toggle.className = "toggle-btn"
      toggle.textContent = node.hasChildNodes() && node.childNodes.length > 1 ? "▼" : ""
      
      const openTag = document.createElement("span")
      openTag.className = "xml-tag"
      openTag.textContent = `<${node.nodeName}`

      // Attributes
      const attrs = document.createElement("span")
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i]
        attrs.innerHTML += ` <span class="xml-attr">${attr.name}</span>=<span class="xml-val">"${attr.value}"</span>`
      }
      
      tagHeader.appendChild(toggle)
      tagHeader.appendChild(openTag)
      tagHeader.appendChild(attrs)
      tagHeader.innerHTML += `<span class="xml-tag">></span>`
      container.appendChild(tagHeader)

      const content = document.createElement("div")
      content.className = "xml-content"
      
      node.childNodes.forEach(child => {
        const childElement = createTreeNode(child)
        if (childElement) content.appendChild(childElement)
      })

      container.appendChild(content)

      const closeTag = document.createElement("div")
      closeTag.className = "xml-tag"
      closeTag.textContent = `</${node.nodeName}>`
      container.appendChild(closeTag)

      // Toggle Logic
      if (toggle.textContent === "▼") {
        tagHeader.onclick = (e) => {
          e.stopPropagation()
          container.classList.toggle("collapsed")
          toggle.textContent = container.classList.contains("collapsed") ? "▶" : "▼"
        }
      }

      return container
    }
    return null
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

  viewBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    if (!xml) {
      showError("Please enter XML to view.")
      return
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      const parseError = xmlDoc.querySelector("parsererror")
      
      if (parseError) throw new Error("Invalid XML structure.")

      viewerOutput.innerHTML = ""
      const tree = createTreeNode(xmlDoc.documentElement)
      viewerOutput.appendChild(tree)
      showSuccess("Tree generated successfully!")
    } catch (error) {
      showError(error.message)
      viewerOutput.innerHTML = '<span style="color: var(--gray-medium);">Error generating tree.</span>'
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    viewerOutput.innerHTML = '<span style="color: var(--gray-medium);">Interactive tree will appear here...</span>'
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
