import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Tabs, Button, Modal, Form, Input } from 'antd'
import { PlusCircleFilled } from '@ant-design/icons'
import ytdl from 'ytdl-core'
import serverAPI, { GuildConfigResponse } from '~/api/server'
import { useStore } from '~/helpers/mobx'
import styles from './styles'

const { TabPane } = Tabs

const Home = () => {
  const params: {
    id: string
  } = useParams()

  const store = useStore()

  const initSettings: GuildConfigResponse = {
    id: '',
    name: '',
    icon: '',
    settings: {},
    customCommand: {},
  }
  const [guildSettings, setGuildSettings] = useState(initSettings as GuildConfigResponse)
  const [isLoading, setIsLoading] = useState(false)
  const [isShowAddCustom, setIsShowAddCustom] = useState(false)
  const [addCustomForm] = Form.useForm()

  useEffect(() => {
    getGuildInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const getGuildInfo = async () => {
    setIsLoading(true)
    try {
      if (!!params.id) {
        const settings = await serverAPI.guild.getSettings(params.id)
        setGuildSettings(settings)
        store.browserData.setSelectedGuild(params.id)
        return
      } else {
        if (!store.browserData.selectedGuild) {
          const userInfo = await serverAPI.userInfo()
          if (!!userInfo.guilds.length) {
            const settings = await serverAPI.guild.getSettings(userInfo.guilds[0].id)
            setGuildSettings(settings)
            store.browserData.setSelectedGuild(settings.id)
            return
          }
          setGuildSettings(initSettings)
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const showAddCustom = () => {
    setIsShowAddCustom(true)
    addCustomForm.resetFields()
  }

  const checkCommand = (rule: any, value: string, callback: Function) => {
    if (!value) {
      return callback([new Error('Please input command name')])
    }
    if (value.indexOf(' ') >= 0) {
      return callback([new Error('no space')])
    }
    return callback()
  }

  const checkYoutubeUrl = (rule: any, value: string, callback: Function) => {
    if (!value) {
      return callback([new Error('Please input youtube url')])
    }
    if (!ytdl.validateURL(value)) {
      return callback([new Error('Invalid youtube url')])
    }
    return callback
  }

  const onAddForm = async () => {
    try {
      const { command, url } = addCustomForm.getFieldsValue()
      await serverAPI.settings.customCommands.add(guildSettings.id, command, url)
      setIsShowAddCustom(false)
    } catch (error) {}
  }

  // Loading
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (!guildSettings.id) {
    return (
      <div>
        <h1>add bot first</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>{guildSettings.name}</h1>
      <Tabs defaultActiveKey="settings">
        <TabPane tab="Settings" key="settings">
          <h2>settings</h2>
        </TabPane>
        <TabPane tab="Commands" key="commands">
          <h2>Commands</h2>
        </TabPane>
        <TabPane tab="Custom Commands" key="customCommands">
          <h2>Custom Commands</h2>
          <Button icon={<PlusCircleFilled />} onClick={showAddCustom}>
            Add
          </Button>
        </TabPane>
      </Tabs>
      <Modal
        visible={isShowAddCustom}
        title="Add Custom Command"
        onOk={addCustomForm.submit}
        onCancel={() => setIsShowAddCustom(false)}
      >
        <h1>add custom</h1>
        <Form form={addCustomForm} onFinish={onAddForm}>
          <Form.Item
            label="Command Name"
            name="command"
            rules={[
              {
                validator: checkCommand,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Youtube Url"
            name="url"
            rules={[
              {
                validator: checkYoutubeUrl,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Home
