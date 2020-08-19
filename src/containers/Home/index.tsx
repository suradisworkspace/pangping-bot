import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'
import serverAPI, { GuildConfigResponse } from '~/api/server'
import { useStore } from '~/helpers/mobx'
import styles from './styles'

const Home = () => {
  const params: {
    id: string
  } = useParams()

  const store = useStore()

  const [guildSettings, setGuildSettings] = useState(null as GuildConfigResponse | null)
  const [isLoading, setIsLoading] = useState(false)

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
          setGuildSettings(null)
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
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

  return (
    <div>
      <h1>{guildSettings?.name}</h1>
    </div>
  )
}

export default Home
