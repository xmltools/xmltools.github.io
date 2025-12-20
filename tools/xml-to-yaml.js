// XML to YAML Converter Tool Logic
;(() => {
  const xmlInput = document.getElementById("xml-input")
  const yamlOutput = document.getElementById("yaml-output")
  const convertBtn = document.getElementById("convert-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function xmlToObj(node) {
    let obj = {}

    if (node.nodeType === 1) { // element
      if (node.attributes.length > 0) {
        obj["@attributes"] = {}
        for (let j = 0; j < node.attributes.length; j++) {
          const attribute = node.attributes.item(j)
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue
        }
      }
    } else if (node.nodeType === 3) { // text
      obj = node.nodeValue.trim()
    }

    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const item = node.childNodes.item(i)
        const nodeName = item.nodeName

        if (nodeName === "#text") {
            const text = item.nodeValue.trim()
            if (text) return text
            continue
        }

        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToObj(item)
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            const old = obj[nodeName]
            obj[nodeName] = []
            obj[nodeName].push(old)
          }
          obj[nodeName].push(xmlToObj(item))
        }
      }
    }
    return obj
  }

  function objToYaml(obj, indent = 0) {
    let yaml = ""
    const spacing = "  ".repeat(indent)

    if (typeof obj !== "object" || obj === null) {
      return String(obj) + "\n"
    }

    for (const key in obj) {
      const value = obj[key]
      if (Array.isArray(value)) {
        yaml += `${spacing}${key}:\n`
        value.forEach(item => {
          yaml += `${spacing}  - ${objToYaml(item, indent + 2).trim()}\n`
        })
      } else if (typeof value === "object") {
        yaml += `${spacing}${key}:\n${objToYaml(value, indent + 1)}`
      } else {
        yaml += `${spacing}${key}: ${value}\n`
      }
    }
    return yaml
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

  convertBtn.addEventListener("click", () => {
    const xml = xmlInput.value.trim()
    if (!xml) {
      showError("Please enter XML code to convert.")
      return
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      const parseError = xmlDoc.querySelector("parsererror")
      
      if (parseError) throw new Error("Invalid XML structure.")

      const obj = {}
      obj[xmlDoc.documentElement.nodeName] = xmlToObj(xmlDoc.documentElement)
      yamlOutput.value = objToYaml(obj)
      showSuccess("Converted to YAML successfully!")
    } catch (error) {
      showError(error.message)
      yamlOutput.value = ""
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput.value = ""
    yamlOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!yamlOutput.value) return
    yamlOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!yamlOutput.value) return
    const blob = new Blob([yamlOutput.value], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.yaml"
    a.click()
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      xmlInput.value = text
      showSuccess("Pasted!")
    } catch (err) {
      showError("Paste failed.")
    }
  })
})()
