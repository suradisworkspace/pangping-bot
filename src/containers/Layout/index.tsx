import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu, Spin, Avatar } from 'antd'
import { useCookies } from 'react-cookie'
import randomColor from 'randomcolor'
import { Observer } from 'mobx-react'
import serverAPI, { GuildDetailsResponse, UserResponse } from '~/api/server'
import { UserOutlined, PlusCircleFilled, DatabaseOutlined } from '@ant-design/icons'
import { useStore } from '~/helpers/mobx'
import discordOauth from '~/discordOauth'
import styles from './styles'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu
type PropsTypes = { children: React.ReactNode }

const Template = (props: PropsTypes) => {
  const history = useHistory()
  const store = useStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies()
  const [loading, setLoading] = useState(true)
  const [guilds, setGuilds] = useState([] as Array<GuildDetailsResponse>)
  const [user, setUser] = useState({} as UserResponse)

  useEffect(() => {
    initiateUser()
  }, [])

  const initiateUser = async () => {
    setLoading(true)
    try {
      // const res = await discordAPI.user.info()
      // console.log('res :>> ', res)
      const res = await serverAPI.userInfo()
      setGuilds(res.guilds)
      setUser(res.user)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const onAddBot = () => {
    const { protocol, hostname, port } = window.location
    const isDevMode = process.env.REACT_APP_MODE === 'dev'
    const url = new URL('https://discord.com/api/oauth2/authorize')
    url.searchParams.append('client_id', discordOauth.clientId)
    url.searchParams.append('permissions', '3147840')
    url.searchParams.append('redirect_uri', `${protocol}//${hostname}${isDevMode ? `:${port}` : ''}`)
    url.searchParams.append('scope', 'bot')
    window.open(url.href)
  }

  const onGuildClick = (guildId: string) => () => {
    history.push(`/guild/${guildId}`)
  }

  const logout = () => {
    removeCookie('access_token')
    removeCookie('refresh_token')
    store.browserData.setSelectedGuild('')
    history.push('/')
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Layout className={styles.themeContainer}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <Observer
          render={() => (
            <Menu
              theme="dark"
              mode="inline"
              defaultOpenKeys={['yourServer']}
              selectedKeys={[store.browserData.selectedGuild]}
            >
              <div className={styles.userInfo}>
                <Avatar
                  className={styles.userInfoAvatar}
                  size={45}
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                >
                  {user.username.charAt(0)}
                </Avatar>
                <div>
                  <p>logged in as:</p>
                  <b>{user.username}</b>
                </div>
              </div>
              <Menu.Item icon={<PlusCircleFilled />} onClick={onAddBot}>
                Add Bot
              </Menu.Item>
              <SubMenu key={'yourServer'} icon={<DatabaseOutlined />} title="Manage Bot">
                {guilds.map((guild) => (
                  <Menu.Item
                    className={styles.serverList}
                    onClick={onGuildClick(guild.id)}
                    key={guild.id}
                    icon={
                      <Avatar
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        className={styles.serverListImage}
                        size={28}
                        style={{
                          backgroundColor: randomColor(),
                        }}
                      >
                        {guild.name.charAt(0)}
                      </Avatar>
                    }
                  >
                    {guild.name}
                  </Menu.Item>
                ))}
              </SubMenu>
              <Menu.Item icon={<UserOutlined />} onClick={logout}>
                Log out
              </Menu.Item>
            </Menu>
          )}
        />
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Created by Suradis Sutampang</Footer>
      </Layout>
    </Layout>
  )
}

export default Template
