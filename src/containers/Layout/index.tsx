import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu, Spin } from 'antd'
import { useCookies } from 'react-cookie'
import styled from 'styled-components'
import serverAPI, { GuildDetailsResponse, UserResponse } from '~/api/server'
import { UserOutlined, PlusCircleFilled, DatabaseOutlined } from '@ant-design/icons'
import './style.css'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu
type PropsTypes = { children: React.ReactNode }
const Template = (props: PropsTypes) => {
  const history = useHistory()
  let selectedServer = ''
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

  const logout = () => {
    removeCookie('access_token')
    removeCookie('refresh_token')
    // removeCookie('uid')
    history.push('/')
  }

  const Img = styled.img`
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.2rem;
  `

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Layout className="theme-container">
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
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedServer]} defaultOpenKeys={['yourServer']}>
          <Menu.Item icon={<PlusCircleFilled />}>Add Bot</Menu.Item>
          <SubMenu key="yourServer" icon={<DatabaseOutlined />} title="Manage Bot">
            {guilds.map((guild) => (
              <Menu.Item
                key={guild.id}
                icon={<Img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt="" />}
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
