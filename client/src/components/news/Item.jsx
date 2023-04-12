import { Card, Typography } from "antd"
import { useNavigate } from "react-router-dom"

/**
 * @typedef {Object} PropsData
 * @property {import("../../../type").NewsInfo} item
 * 
 * @param {PropsData} props 
 */

const itemNews = ({ item }) => {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/news/${item.slug}`)}>
      <Card
        hoverable
        cover={<img src={item.image_url} style={{
          height: 300,
          maxWidth: "unset",
          objectFit: "cover"
        }} />}
      >
        <Card.Meta title={item.title} description={
          <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: false, symbol: "more" }}
        >
          {item.content_post.replace(/<[^>]*>?/gm, '')}
        </Typography.Paragraph>} />
      </Card>
    </div>
  )
}

export default itemNews