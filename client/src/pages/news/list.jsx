import { useState } from "react";
import ItemNews from "../../components/news/Item";
import axiosUser from "../../api/axios/user";
import { useEffect } from "react";
import { List } from "antd";
import { useParams } from "react-router-dom";
import listNewsType from "../../libs/news_type/list";

const ListNewsPage = () => {
  const [listNews, setListNews] = useState([]);
  const [titleNews, setTitleNews] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataMeta, setDataMeta] = useState({});
  const { type } = useParams();
  const params = {};
  if (type) {
    const category = listNewsType.find(({ slug }) => slug === type);
    params.new_type_id = category.id;
  }

  const getListNews = async (page) => {
    setIsLoading(true);
    axiosUser
      .get("/news/list", {
        params: {
          ...params,
          page,
        },
      })
      .then((res) => {
        setListNews(res.data.data);
        setDataMeta(res.data.meta);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getListNews();
    const category = listNewsType.find(({ slug }) => slug === type);
    setTitleNews(category.name);
  }, [type]);

  return (
    <div className="px-4 pb-8 pt-8 space-y-4">
      <div className="text-xl font-semibold">{titleNews}</div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        loading={isLoading}
        dataSource={listNews}
        pagination={{
          onChange: getListNews,
          pageSize: dataMeta.page_size,
          total: dataMeta.total_object,
        }}
        renderItem={(item) => (
          <List.Item>
            <ItemNews item={item} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListNewsPage;
