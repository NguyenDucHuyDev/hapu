import React from "react";
import { Col, Divider, Row } from "antd";
import productsHomeLib from "../../../libs/home/products";
import {Pagination } from "antd";
import ItemProductGray from "../../products/ItemGray";

const ShowProduct = (props) => {
  const { dataProduct, setDataProduct } = props;
  const handleOnChangePage = (page, pageSize) => {
    setDataProduct({
      ...dataProduct,
      pageCurrent: {
        current_page: page,
        per_page: pageSize,
      },
    });
  };

  return (
    <div className="showProduct">
      <div className="showProduct__main">
        <div className="text-black w-full p-5 border bg-white rounded-lg shadow-lg shadow-indigo-500/40">
          {dataProduct.pageCurrent.total_object !== 0 ? (
            <>
              <div className="text-xl font-bold my-5">
                {productsHomeLib.product}
              </div>

              <Row gutter={[20, 30]}>
                {dataProduct.data.map((item) => {
                  return (
                    <Col
                      lg={{
                        span: 6,
                      }}
                      xs={{
                        span: 12,
                      }}
                      xxl={{
                        span: 4,
                      }}
                      key={`product_${item.id}`}
                    >
                      <ItemProductGray item={item} showBadge={true} showFooter={true} />
                    </Col>
                  );
                })}
              </Row>

              <div className="mt-5 flex justify-center">
                <Pagination
                  total={dataProduct.pageCurrent.total_object}
                  pageSize={dataProduct.pageCurrent.per_page}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `Total ${total} items`}
                  onChange={handleOnChangePage}
                />
              </div>
            </>
          ) : (
            <>
              <Divider
                orientation="center"
                style={{ fontSize: "20px", fontWeight: "700" }}
              >
                KHÔNG CÓ SẢN PHẨM
              </Divider>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShowProduct);
