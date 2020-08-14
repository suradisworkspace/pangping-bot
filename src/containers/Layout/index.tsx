import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu, Space, Spin } from 'antd'
import { useCookies } from 'react-cookie'
import discordAPI from '~/api/discord'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PlusCircleFilled,
  DatabaseOutlined,
} from '@ant-design/icons'
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

  useEffect(() => {
    initiateUser()
  }, [])

  const initiateUser = async () => {
    setLoading(true)
    try {
      const res = await discordAPI.user.info()
      console.log('res :>> ', res)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeCookie('accessToken')
    removeCookie('refreshToken')
    history.push('/')
  }

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
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              nav 4
            </Menu.Item>
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
