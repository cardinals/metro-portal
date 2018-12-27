import http from '@/plugins/axios.js'
const baseUrl = '/portal'
// 贴片列表清单
const patchList = (params) => http.get(`${baseUrl}/patchList`, params)
// 删除贴片
const deletePatch = (params) => http.get(`${baseUrl}/deletePatch`, params)
// 取消删除/添加
const cancelPatch = (params) => http.get(`${baseUrl}/cancelPatch`, params)
// 添加贴片
const addPatch = (params) => http.post(`${baseUrl}/addPatch`, params, 'application/json')
// 彻底删除
const removePatch = (params) => http.get(`${baseUrl}/removePatch`, params)
// 权限信息/图标库
const roleAndIcon = (params) => http.get(`${baseUrl}/roleAndIcon`, params)
// 新增贴片
const createPatch = (params) => http.post(`${baseUrl}/createPatch`, params, 'application/json')
// 编辑贴片
const editPatch = (params) => http.post(`${baseUrl}/editPatch`, params, 'application/json')
// 用户同步超管信息
const initAdd = () => http.get(`${baseUrl}/initAdd`)
// 首页布局信息
const layoutInfo = () => http.get(`${baseUrl}/layoutInfo`)
// 首页保存桌面
const savePatch = (params) => http.post(`${baseUrl}/savePatch`, params, 'application/json')
// 登录
const login = (params) => http.get(`${baseUrl}/login`, params)
// 注销
const logout = () => http.get(`${baseUrl}/logout`)
// 获取用户权限信息
const userRole = () => http.get(`${baseUrl}/userRole`)
// 一键还原
const fallback = () => http.get(`${baseUrl}/fallback`)
// 验证标题是否重名
const validationTitle = (params) => http.get(`${baseUrl}/validationTitle`, params)
export { patchList, deletePatch, cancelPatch, addPatch, removePatch, roleAndIcon, createPatch, editPatch, initAdd, layoutInfo, savePatch, login, logout, userRole, fallback, validationTitle }
