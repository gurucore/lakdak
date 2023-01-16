function a() {
  return 1;
}
const s = {};
class d {
  static getCurrentServerIpAddresses(r = "v4") {
    return Object.values(s.networkInterfaces()).reduce((e, t) => (e = e.concat(t), e), []).filter(({ family: e, address: t }) => e.toLowerCase().indexOf(r) >= 0 && t !== "127.0.0.1").map(({ address: e }) => e).join(", ");
  }
  static extractIpFromRequest(r) {
    return r?.socket?.remoteAddress || r?.headers["x-forwarded-for"];
  }
}
export {
  d as DevOpsHelper,
  a as testFunction
};
