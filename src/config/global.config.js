import projectInfo from '../../package.json'

export default {
  version: projectInfo.version,
  sso: `http://10.228.82.4/uc/#/user/login?redirect=${encodeURIComponent(window.location.href)}&code=IIS`
}
