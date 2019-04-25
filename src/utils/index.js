export function _uuid() {
  var d = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = ((d + Math.random() * 16) % 16) | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function exportCsv(data, columns, title) {
  let csv = JSONtoCSV(data, columns)

  let createAndDownloadFile = (fileName, content) => {
    let aTag = document.createElement('a')
    let blob = new Blob(['\uFEFF', content])
    aTag.download = fileName
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
    URL.revokeObjectURL(blob)
  }
  createAndDownloadFile(title, csv)
}

export function JSONtoCSV(arr, columns, delimiter = ',') {
  return [
    ...arr.map(obj =>
      columns.reduce(
        (acc, key) =>
          `${acc}${!acc.length ? '' : delimiter}"${!obj[key] ? '' : obj[key]}"`,
        ''
      )
    )
  ].join('\n')
}

export function deepCopy(obj) {
  let obj_cp = JSON.parse(JSON.stringify(obj))
  return obj_cp
}
