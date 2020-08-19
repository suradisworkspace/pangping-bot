import { css } from 'emotion'

export default {
  themeContainer: css`
    min-height: 100vh !important;
  `,
  loadingContainer: css`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  userInfo: css`
    width: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
    flex-direction: row;
  `,
  userInfoAvatar: css`
    margin-right: 4px;
  `,
  serverList: css`
    padding-left: 32px !important;
  `,
  serverListImage: css`
    margin-right: 4px;
  `,
}
