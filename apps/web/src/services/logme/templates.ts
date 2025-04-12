export const checkTemplateCopy = async (notionPageId: string, token: string) => {
  const res = await fetch(`/api/logme/templates/check-copy?notionPageId=${notionPageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const checkTemplatePublic = async (notionPageId: string, token: string) => {
  const res = await fetch(`/api/logme/templates/check-public?notionPageId=${notionPageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const getNotionPageUrl = async (notionPageId: string, token: string) => {
  const res = await fetch(`/api/logme/templates/get-url?notionPageId=${notionPageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
