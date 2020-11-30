// 传进来dataClassification数组
const formatDcList = (list) => {
  const result = []
  list.forEach(e => {
    if (e.parentId === '') {
      const isHas = result.find(t => e.id === t.id)
      if (!isHas) {
        result.push({
          id: e.id || e.dcId,
          label: e.name || e.dcName,
          children: []
        })
      } else {
        isHas.label = e.name || e.dcName
      }
    } else {
      const isHas = result.find(t => e.parentId === t.id)
      if (isHas) {
        isHas.children.push({
          id: e.id || e.dcId,
          label: e.name || e.dcName
        })
      } else {
        result.push({
          id: e.parentId,
          label: '空',
          children: [{
            id: e.id || e.dcId,
            label: e.name || e.dcName
          }]
        })
      }
    }
  })
  return result
}

export default formatDcList
