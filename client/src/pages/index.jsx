import { Button, Carousel, Col, Row, Spin } from "antd";
import {
  SearchOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
import axiosUser from "../api/axios/user";
import { useRef } from "react";
import ItemProduct from "../components/products/Item";
import ItemProductGray from "../components/products/ItemGray";
import Reviewer1 from "../assets/images/reviewer/709451.jpg";
import Reviewer2 from "../assets/images/reviewer/1898413.png";
import Reviewer3 from "../assets/images/reviewer/2148168.jpg";
import { useNavigate } from "react-router-dom";

const reviewList = [
  {
    user: {
      avatar: Reviewer1,
      full_name: "Reviewer 1",
      location: "Reviewer 1 location",
    },
    comment:
      "Nhân viên hỗ trợ nhiệt tình. Có nhiều chương trình khuyến mãi hay",
  },
  {
    user: {
      avatar: Reviewer2,
      full_name: "Reviewer 2",
      location: "Reviewer 2 location",
    },
    comment: `Từ ngày biết đến website Giá thuốc Hapu mình không còn
    phải mất công đến chợ sỉ để nhặt hàng nữa. Sản phẩm ở
    đây rất đa dạng, đáp ứng được hầu hết nhu cầu của quầy
    thuốc`,
  },
  {
    user: {
      avatar: Reviewer3,
      full_name: "Reviewer 3",
      location: "Reviewer 3 location",
    },
    comment:
      "Nhân viên hỗ trợ nhiệt tình. Có nhiều chương trình khuyến mãi hay",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoadingCarousel, setLoadingCarousel] = useState(false);
  const [isLoadingHotProduct, setLoadingHotProduct] = useState(false);
  const [isDisabledNextHotProduct, setDisabledNextHotProduct] = useState(false);
  const [isDisabledPrevHotProduct, setDisabledPrevHotProduct] = useState(true);
  const CarouselBanner = useRef();
  const reviewCarousel = useRef();
  const rowListHotProducts = useRef();
  const [listBanners, setListBanners] = useState([]);
  const [listHotProducts, setListHotProducts] = useState([]);
  const [currentCarouselReviewPosition, setCurrentCarouselReviewPosition] =
    useState(0);

  const getBanner = () => {
    return axiosUser
      .get("/banner/list/")
      .then((res) => {
        setListBanners(res.data.data);
      })
      .finally(() => setLoadingCarousel(false));
  };


  const getListHotProducts = () => {
    setLoadingHotProduct(true);
    return axiosUser
      .get("/product/hot")
      .then((res) => {
        setListHotProducts(res.data.data);
      })
      .finally(() => setLoadingHotProduct(false));
  };

  const handleChangeCarouselReview = (current) => {
    setCurrentCarouselReviewPosition(current);
  };

  const reviewCarouselGoto = (index) => {
    reviewCarousel.current.goTo(index);
  };

  const handleNextListHotProduct = () => {
    if (isDisabledNextHotProduct) return;
    const widthPerItem = rowListHotProducts.current.offsetWidth / 6;
    const scrollLeft = rowListHotProducts.current.scrollLeft;
    const next = scrollLeft + widthPerItem + 1;
    rowListHotProducts.current.scroll({
      left: next,
      behavior: "smooth",
    });
    if (next + scrollLeft >= rowListHotProducts.current.scrollWidth) {
      setDisabledNextHotProduct(true);
    }
    setDisabledPrevHotProduct(false);
  };


  const handlePrevListHotProduct = () => {
    if (isDisabledPrevHotProduct) return;
    const widthPerItem = rowListHotProducts.current.offsetWidth / 6;
    const scrollLeft = rowListHotProducts.current.scrollLeft;
    const prev = scrollLeft - widthPerItem - 1;
    rowListHotProducts.current.scroll({
      left: prev,
      behavior: "smooth",
    });
    if (prev <= 0) {
      setDisabledPrevHotProduct(true);
    }
    setDisabledNextHotProduct(false);
  };
  // gửi yêu cầu khi tìm tiếm => huy
  const onFinishSearch = (values) => {
    navigate(`/product?q=${values.inputSearch}`);
  };

  useEffect(() => {
    setLoadingCarousel(true);
    Promise.all([getBanner(), getListHotProducts() ]).then(
      () => {}
    );
  }, []);


  return (
    <div>
      <div>
        {isLoadingCarousel ? (
          <div className="flex justify-center items-center">
            <Spin />
          </div>
        ) : (
          <Carousel ref={CarouselBanner} autoplay={false}>
            {listBanners.map((banner) => {
              return (
                  <img
                    src={banner.image_url}
                    className="w-full rounded-2xl h-[400px] object-cover"
                  />
              );
            })}
          </Carousel>
        )}
      </div>
      <div className="px-2 py-10 bg-white-100 space-y-12">
        <div className="text-4xl text-center font-semibold">
          Sản phẩm nổi bật
        </div>
        {isLoadingHotProduct ? (
          <div className="flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <>
            <Row
              gutter={20}
              wrap={false}
              className="overflow-hidden"
              ref={rowListHotProducts}
            >
              {listHotProducts.map((item) => {
                return (
                  <Col
                    xs={{
                      span: 12,
                    }}
                    key={`hot_product_${item.id}`}
                    lg={{
                      span: 6,
                    }}
                    xxl={{
                      span: 6,
                    }}
                  >
                    <ItemProduct item={item} />
                  </Col>
                );
              })}
            </Row>
            <Row gutter={20} justify="center">
              <Col>
                <Button
                  type={isDisabledPrevHotProduct ? false : "primary"}
                  className={
                    isDisabledPrevHotProduct
                      ? "bg-white text-blue-500"
                      : "bg-blue-500"
                  }
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePrevListHotProduct}
                />
              </Col>
              <Col>
                <Button
                  type={isDisabledNextHotProduct ? false : "primary"}
                  size="large"
                  className={
                    isDisabledNextHotProduct
                      ? "bg-white text-blue-500"
                      : "bg-blue-500"
                  }
                  icon={<ArrowRightOutlined />}
                  onClick={handleNextListHotProduct}
                />
              </Col>
            </Row>
          </>
        )}
      </div>
      <div className="px-2 py-10 space-y-12 pb-40">
        <div className="text-4xl text-center font-semibold">
          Cảm nhận của khách hàng
        </div>
        <div className="relative">
          <div className="max-w-[1000px] mx-auto z-20 relative">
            <div className="bg-gray-100 rounded-lg p-8">
              <Carousel
                autoplay={false}
                dots={false}
                ref={reviewCarousel}
                afterChange={handleChangeCarouselReview}
              >
                {reviewList.map((review, index) => {
                  return (
                    <div key={`review_${index}`}>
                      <div className="flex gap-x-4">
                        <div className="flex-auto w-80">
                          <img
                            src={review.user.avatar}
                            className="w-full rounded-lg"
                          />
                        </div>
                        <div className="space-y-4 flex-auto">
                          <div className="p-2 bg-sky-500 text-white w-min rounded-full">
                            <TagOutlined
                              style={{
                                fontSize: "24px",
                              }}
                            />
                          </div>
                          <blockquote className="text-lg font-semibold">
                            {review.comment}
                          </blockquote>
                          <div className="space-x-4 font-medium">
                            <span>{review.user.full_name}</span>
                            <span>-</span>
                            <span className="text-slate-800">
                              {review.user.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
          <div className="absolute inset-x-0 h-80 w-[1100px] max-w-full left-1/2 -translate-x-1/2 bg-black rounded-lg -bottom-20 z-10">
            <div className="relative w-full h-full">
              <div className="flex space-x-2 absolute bottom-8 left-1/2 -translate-x-1/2">
                {reviewList.map((review, index) => {
                  return (
                    <div
                      key={`dot_review_${index}`}
                      className={`w-2 h-2 rounded-full cursor-pointer ${
                        currentCarouselReviewPosition === index
                          ? "bg-green-500"
                          : "bg-white"
                      }`}
                      onClick={() => reviewCarouselGoto(index)}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
