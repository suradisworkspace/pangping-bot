import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { Layout, Menu } from 'antd'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { removeToken } from '~/redux/auth/actions'
import './style.css'

const { Header, Content, Footer, Sider } = Layout
const mapStateToProps = (state: Object) => state
const mapDispatchToProps = {
  removeToken,
}
const connector = connect(mapStateToProps, mapDispatchToProps)
type ReduxProps = ConnectedProps<typeof connector>
type PropsTypes = ReduxProps & { children: React.ReactNode }

const Template = (props: PropsTypes) => {
  const history = useHistory()
  useEffect(() => {}, [])

  const logout = () => {
    props.removeToken()
    history.push('/')
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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            nav 4
          </Menu.Item>
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

export default connector(Template)
