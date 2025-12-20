// XPath Tester Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const xpathQuery = document.getElementById("xpath-query")
  const testResults = document.getElementById("test-results")
  const testBtn = document.getElementById("test-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function evaluateXPath(xml, query) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")

      // Check for XML parsing errors
      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        throw new Error("Invalid XML: " + parseError.textContent)
      }

      const results = []
      const xpathResult = xmlDoc.evaluate(
        query,
        xmlDoc,
        null,
        XPathResult.ANY_TYPE,
        null
      )

      let node = xpathResult.iterateNext()
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          results.push(new XMLSerializer().serializeToString(node))
        } else {
          results.push(node.textContent)
        }
        node = xpathResult.iterateNext()
      }

      if (results.length === 0) {
        return "No matches found."
      }

      return results.join("\n---\n")
    } catch (error) {
      throw new Error("XPath Error: " + error.message)
    }
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

  testBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    const query = xpathQuery.value.trim()

    if (!xml || !query) {
      showError("Please provide both XML and an XPath expression.")
      return
    }

    try {
      const result = evaluateXPath(xml, query)
      testResults.value = result
      showSuccess("XPath evaluated successfully!")
    } catch (error) {
      showError(error.message)
      testResults.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    xpathQuery.value = ""
    testResults.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!testResults.value) {
      showError("Nothing to copy.")
      return
    }
    testResults.select()
    document.execCommand("copy")
    showSuccess("Results copied!")
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      xmlInput.value = text
      showSuccess("XML Pasted!")
    } catch (err) {
      showError("Paste failed. Use Ctrl+V.")
    }
  })
})()
