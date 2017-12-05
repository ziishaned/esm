import FastObject from "../fast-object.js"

import readFileFast from "../fs/read-file-fast.js"
import { readFileSync } from "fs"
import stripBOM from "../util/strip-bom.js"
import toNamespacedPath from "../path/to-namespaced-path.js"

const { dlopen } = process
const { parse } = JSON
const _extensions = new FastObject

_extensions[".js"] = (mod, filePath) => {
  mod._compile(stripBOM(readFileSync(filePath, "utf8")), filePath)
}

_extensions[".json"] = (mod, filePath) => {
  const content = readFileFast(filePath, "utf8")

  try {
    mod.exports = parse(content)
  } catch (error) {
    error.message = filePath + ": " + error.message
    throw error
  }
}

_extensions[".node"] = (mod, filePath) => {
  return dlopen(mod, toNamespacedPath(filePath))
}

export default _extensions
