import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Tabs, Button, Modal, Form, Input } from 'antd'
import { PlusCircleFilled } from '@ant-design/icons'
import { map } from 'lodash'
import ytdl from 'ytdl-core'
import serverAPI, { SettingsResponse } from '~/api/server'
import { useStore } from '~/helpers/mobx'
import styles from './styles'

const { TabPane } = Tabs

const Home = () => {
  const params: {
    id: string
  } = useParams()

  const store = useStore()

  const [guildInfo, setGuildInfo] = useState(
    {} as {
      id: string
      name: string
      icon: string
    }
  )
  const [customCommands, setCustomCommands] = useState({} as Object)
  const [isLoading, setIsLoading] = useState(false)
  const [isShowAddCustom, setIsShowAddCustom] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isShowDeleteCommand, setIsShowDeleteCommand] = useState(false)
  const [selectedDeleteCommand, setSelectedDeleteCommand] = useState('')
  const [addCustomForm] = Form.useForm()
  const [settingsForm] = Form.useForm()

  useEffect(() => {
    getGuildInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const getGuildInfo = async () => {
    setIsLoading(true)
    try {
      let selectedGuild = params.id
      if (!selectedGuild) {
        if (store.browserData.selectedGuild) {
          selectedGuild = store.browserData.selectedGuild
        } else {
          const userInfo = await serverAPI.userInfo()
          selectedGuild = userInfo.guilds[0].id
        }
      }
      const settings = await serverAPI.guild.getSettings(selectedGuild)
      setGuildInfo({
        id: settings.id,
        name: settings.name,
        icon: settings.icon,
      })
      settingsForm.setFieldsValue(settings.settings)
      setCustomCommands(settings.customCommands)
      store.browserData.setSelectedGuild(settings.id)
      return
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
    return callback()
  }

  const onAddForm = async () => {
    try {
      const { command, url } = addCustomForm.getFieldsValue()
      const addRes = await serverAPI.settings.customCommands.add(guildInfo.id, command, url)
      setCustomCommands(addRes)
      setIsShowAddCustom(false)
    } catch (error) {
      if (error.response && error.response.data.status === 'error') {
        alert(error.response.data.message)
      }
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      const settings = settingsForm.getFieldsValue() as SettingsResponse
      const settingsRes = await serverAPI.settings.common.editSettings(guildInfo.id, settings)
      settingsForm.setFieldsValue(settingsRes)
    } catch (error) {
    } finally {
      setIsSaving(false)
    }
  }

  const showDeleteCommand = (command: string) => () => {
    setSelectedDeleteCommand(command)
    setIsShowDeleteCommand(true)
  }

  const deleteCommand = async () => {
    try {
      const deleteRes = await serverAPI.settings.customCommands.delete(guildInfo.id, selectedDeleteCommand)
      setCustomCommands(deleteRes)
    } catch (error) {
    } finally {
      setIsShowDeleteCommand(false)
    }
  }

  // Loading
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (!guildInfo.id) {
    return (
      <div>
        <h1>add bot first</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>{guildInfo.name}</h1>
      <Tabs defaultActiveKey="settings">
        <TabPane tab="Settings" key="settings">
          <h2>settings</h2>
          <Form form={settingsForm} onFinish={saveSettings}>
            <Form.Item label="Command prefix" name="commandPrefix" rules={[{ required: true, message: 'required' }]}>
              <Input />
            </Form.Item>
          </Form>
          <Button onClick={settingsForm.submit} loading={isSaving}>
            Save
          </Button>
        </TabPane>
        {/* <TabPane tab="Commands" key="commands">
          <h2>Commands</h2>
        </TabPane> */}
        <TabPane tab="Custom Commands" key="customCommands">
          <h2>Custom Commands</h2>
          <Button icon={<PlusCircleFilled />} onClick={showAddCustom}>
            Add
          </Button>
          {map(customCommands, (url, command) => {
            return (
              <div className={styles.customListContainer}>
                <div className={styles.customListInputContainer}>
                  <Input addonBefore={command} disabled value={url.toString()} />
                </div>
                <Button onClick={showDeleteCommand(command)}>Delete</Button>
              </div>
            )
          })}
        </TabPane>
      </Tabs>
      <Modal
        visible={isShowDeleteCommand}
        title="Delete Command"
        onOk={deleteCommand}
        onCancel={() => setIsShowDeleteCommand(false)}
      >
        <h3>Are you sure to delete {selectedDeleteCommand} command</h3>
      </Modal>
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
