import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu, Spin, Avatar } from 'antd'
import { useCookies } from 'react-cookie'
import randomColor from 'randomcolor'
import serverAPI, { GuildDetailsResponse, UserResponse } from '~/api/server'
import { UserOutlined, PlusCircleFilled, DatabaseOutlined } from '@ant-design/icons'
import { useStore } from '~/helpers/mobx'
import styles from './styles'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu
type PropsTypes = { children: React.ReactNode }
const Template = (props: PropsTypes) => {
  const history = useHistory()
  const store = useStore()
  const { selectedGuild } = store.browserData
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
    const url =
      'https://discord.com/api/oauth2/authorize?client_id=701046332835758101&permissions=3147840&redirect_uri=https%3A%2F%2Fpangping.herokuapp.com%2F&scope=bot'
    window.open(url, '_self')
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
        <Menu theme="dark" mode="inline" defaultOpenKeys={['yourServer']} selectedKeys={[selectedGuild]}>
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
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Template
