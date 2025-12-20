// XML Validator Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const validateBtn = document.getElementById("validate-btn")
  const clearBtn = document.getElementById("clear-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const validationResult = document.getElementById("validation-result")
  const resultTitle = document.getElementById("result-title")
  const resultIcon = document.getElementById("result-icon")
  const resultDetails = document.getElementById("result-details")

  function validateXML(xml) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")

      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        return {
          valid: false,
          error: parseError.textContent,
          message: "XML parsing failed",
        }
      }

      // Count elements
      const allElements = xmlDoc.getElementsByTagName("*")
      const elementCount = allElements.length

      // Check for root element
      if (!xmlDoc.documentElement) {
        return {
          valid: false,
          error: "No root element found",
          message: "XML must have a single root element",
        }
      }

      return {
        valid: true,
        elementCount: elementCount,
        rootElement: xmlDoc.documentElement.nodeName,
        message: "XML is well-formed and valid",
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        message: "XML validation error",
      }
    }
  }

  function displayResult(result) {
    validationResult.style.display = "block"

    if (result.valid) {
      validationResult.className = "validation-result success"
      resultTitle.textContent = "✓ Valid XML"
      resultIcon.textContent = "✓"
      resultDetails.innerHTML = `
                <p><strong>Status:</strong> ${result.message}</p>
                <p><strong>Root Element:</strong> &lt;${result.rootElement}&gt;</p>
                <p><strong>Total Elements:</strong> ${result.elementCount}</p>
                <p><strong>Well-formed:</strong> Yes</p>
            `
    } else {
      validationResult.className = "validation-result error"
      resultTitle.textContent = "✗ Invalid XML"
      resultIcon.textContent = "✗"
      resultDetails.innerHTML = `
                <p><strong>Status:</strong> ${result.message}</p>
                <p><strong>Error:</strong></p>
                <pre>${result.error}</pre>
                <p><strong>Suggestion:</strong> Check for unclosed tags, improper nesting, or invalid characters.</p>
            `
    }
  }

  validateBtn.addEventListener("click", () => {
    const input = xmlInput.value.trim()

    if (!input) {
      validationResult.style.display = "block"
      validationResult.className = "validation-result error"
      resultTitle.textContent = "No Input"
      resultIcon.textContent = "!"
      resultDetails.innerHTML = "<p>Please enter XML code to validate.</p>"
      return
    }

    const result = validateXML(input)
    displayResult(result)
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    validationResult.style.display = "none"
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      xmlInput.value = text

      // Show temporary success message
      validationResult.style.display = "block"
      validationResult.className = "validation-result success"
      resultTitle.textContent = "Pasted"
      resultIcon.textContent = "✓"
      resultDetails.innerHTML = "<p>Content pasted from clipboard. Click Validate to check.</p>"

      setTimeout(() => {
        validationResult.style.display = "none"
      }, 2000)
    } catch (error) {
      validationResult.style.display = "block"
      validationResult.className = "validation-result error"
      resultTitle.textContent = "Paste Failed"
      resultIcon.textContent = "✗"
      resultDetails.innerHTML = "<p>Failed to paste from clipboard. Please paste manually using Ctrl+V or Cmd+V.</p>"
    }
  })
})()
