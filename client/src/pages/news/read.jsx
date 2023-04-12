
import { Spin } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosUser from "../../api/axios/user";

const ReadNewsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [dataNews, setDataNews] = useState({})
  const { slug } = useParams()
  const getNews = (slug) => {
    setIsLoading(true)
    return axiosUser.get("/news", {
      params: {
        slug
      }
    })
    .then((res) => {
      setDataNews(res.data.data)
    })
    .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getNews(slug)
  }, [])
  return (
    <div className="px-4 lg:pb-48 pt-8">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Spin />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-2xl font-semibold">{dataNews.title}</div>
          <div className="content-post" dangerouslySetInnerHTML={{__html: dataNews.content_post}}>
          </div>
        </div>
      )
  }
      </div>
  )
} 

export default ReadNewsPage