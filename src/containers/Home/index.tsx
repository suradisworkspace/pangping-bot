import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import serverAPI from '~/api/server'
import { useStore } from '~/helpers/mobx'
const Home = () => {
  const params: {
    id: string
  } = useParams()

  const store = useStore()

  useEffect(() => {
    getGuildInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const getGuildInfo = async () => {
    if (!!params.id) {
      console.log('here')
      try {
        const res = await serverAPI.guild.getSettings(params.id)
        console.log('res :>> ', res)
        store.browserData.setSelectedGuild(params.id)
      } catch (error) {}
    }
  }
  return (
    <div>
      <h1>login here</h1>
    </div>
  )
}

export default Home
