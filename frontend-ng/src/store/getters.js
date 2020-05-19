const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  redPacketList: state => state.rp.redPacketList,
  redPacketItemList: state => state.rp.redPacketItemList,
  probabilityList: state => state.rp.probabilityList,
  projectList: state => state.rp.projectList,
  loading1: state => state.rp.loading1,
  loading2: state => state.rp.loading2,
  loading3: state => state.rp.loading3,
  itemDialogVisible: state => state.rp.itemDialogVisible,
  probabilityDialogVisible: state => state.rp.probabilityDialogVisible
}
export default getters
