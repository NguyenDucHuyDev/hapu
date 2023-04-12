import {
  Button,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Space,
  Spin,
  Typography,
  Col,
  Select,
  Upload,
} from "antd";

import { SOURCE_NEWS } from "../../../../type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosAdmin from "../../../api/axios/admin";
import { errorMessage } from "../../../errors/messages";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import { InboxOutlined } from "@ant-design/icons";

import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat.js";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Indent from "@ckeditor/ckeditor5-indent/src/indent.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation.js";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";

const urlAPI = import.meta.env.VITE_MY_API_PATH;

const editorConfig = {
  plugins: [
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Table,
    TableToolbar,
    TextTransformation,
    ImageInsert,
    // AutoImage,
    Image,
    SimpleUploadAdapter,
  ],
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "alignment",
      "|",
      "outdent",
      "indent",
      "|",
      "insertImage",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
  },
  language: "ja",
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  simpleUpload: {
    // The URL that the images are uploaded to.
    uploadUrl: `${urlAPI}/admin/upload/image`,

    // Enable the XMLHttpRequest.withCredentials property.
    withCredentials: false,

    // Headers sent along with the XMLHttpRequest to the upload server.
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token_admin")}`,
      "Upload-From": "CKEDITOR",
    },
  },
};

const onFinishFailed = () => {};

const { Text } = Typography;

const editNewsPage = () => {
  return editNewsPageForm({
    path: "/admin/news/",
    isCreate: false,
    title: "Chỉnh sửa thông tin",
  });
};

const source_news = Object.entries(SOURCE_NEWS).map(([value, label]) => ({
  label,
  value,
}));

const editNewsPageForm = ({ path, isCreate, title }) => {
  const [api, contextHolder] = notification.useNotification();
  const [infoNews, setInfoNews] = useState({});
  const [listNewsType, setListNewsType] = useState([]);
  const [contentNews, setContentNews] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [urlImage, setUrlImage] = useState("")
  let slug;
  if (!isCreate) {
    slug = useParams().slug;
  }
  const handleUpload = (data) => {
    if(data.file.status === "done") {
      const url = data.file.response.data.url
      setUrlImage(url)
    }
  }
  const getData = async (slug) => {
    const res = await axiosAdmin.get(path, {
      params: {
        slug,
      },
    });
    setInfoNews(res.data.data);
    setUrlImage(res.data.data.image_url)
  };

  const getNewsType = async () => {
    const buildFieldOption = (data) => {
      return data.map((_) => ({
        label: _.name,
        value: _.id,
      }));
    };
    const res = await axiosAdmin.get("/news_type/list");
    /**
     * @type {import("../../../../type").NewTypeInfo[]}
     */
    const news_type = res.data.data;
    setListNewsType(buildFieldOption(news_type));
  };

  const onFinish = async (data) => {
    if(!urlImage) {
      api.error({
        message: "Vui lòng upload ảnh bìa bài viết!",
        duration: 5,
      });
      return
    }
    setLoadingForm(true);
    const adapter = isCreate ? axiosAdmin.post : axiosAdmin.patch;
    const res = await adapter(
      path,
      {
        ...data,
        content_post: contentNews,
        image_url: urlImage,
      },
      {
        params: {
          slug,
        },
      }
    )
      .catch((e) => {
        api.error({
          message: "Có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        setLoadingForm(false);
      });
    if (res.data.status) {
      api.success({
        message: isCreate ? "Tạo mới thành công" : "Cập nhật thành công",
        duration: 5,
      });
    } else {
      api.error({
        message: res.data.message,
        duration: 5,
      });
    }
  };
  useEffect(() => {
    setLoading(true)
    const handlers = [getNewsType()];
    if (!isCreate) handlers.push(getData(slug));
    Promise.all(handlers).finally(() => setLoading(false));
  }, []);
  return (
    <>
      {contextHolder}
      <Divider className="!text-lg" orientation="left">
        {title}
      </Divider>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spin tip="Đang tải" />
        </div>
      ) : (
        <>
          {!isCreate && (
            <Space direction="vertical">
              <Text type="secondary">Ngày mua: {infoNews.created_at}</Text>
              <Text type="secondary">
                Cập nhật lần cuối lúc: {infoNews.updated_at}
              </Text>
            </Space>
          )}
          <Form
            name="basic"
            onFinish={onFinish}
            initialValues={infoNews}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{
              marginTop: "10px",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tiêu đề bài viết"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Loại bài viết"
                  name="new_type_id"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                  <Select options={listNewsType} />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  label="Ảnh bìa bài viết"
                  name="image_url"
                  rules={[
                    {
                      required: true,
                      message: errorMessage.common.required,
                    },
                  ]}
                >
                <Upload.Dragger
                    accept="image/*"
                    action={`${urlAPI}/admin/upload/image`}
                    listType="picture"
                    headers={{
                      Authorization: `Bearer ${localStorage.getItem("access_token_admin")}`
                    }}
                    maxCount={1}
                    onChange={handleUpload}
                    defaultFileList={urlImage ? [{
                      status: 'done',
                      url: urlImage,
                      thumbUrl: urlImage,
                    }] : []}
                    >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Kéo thả vào khu vực này để upload
                    </p>
                    <p className="ant-upload-hint">
                      Vui lòng chỉ upload 1 ảnh, không upload nhiều ảnh bìa bài viết
                    </p>
                  </Upload.Dragger>
                  </Form.Item>
              </Col>
            </Row>
            <div className="my-4">
              <div className="mb-4">Nội dung bài viết</div>
              <CKEditor
                editor={ClassicEditor}
                data={infoNews.content_post}
                config={editorConfig}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContentNews(data);
                }}
              />
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingForm}
                className="bg-blue-500"
              >
                {isCreate ? "Tạo mới" : "Cập nhật"}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export { editNewsPageForm };

export default editNewsPage;
