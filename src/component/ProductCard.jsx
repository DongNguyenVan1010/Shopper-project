import { message, Spin } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAsync } from "../core";
import { useReduxAsync } from "../core/hooks/useReduxAsync";
import profileService from "../service/profile.service";
import { addCartAction } from "../store/cartReducer";
import { currency } from "../utils/currency";

export default function ProductCard({
  _id,
  id,
  name,
  images,
  price,
  real_price,
  discount_rate,
  rating_average,
  review_count,
  thumbnail_url,
  slug,
}) {
  const img1 = images?.[ 0 ]?.thumbnail_url;
  const img2 = images?.[ 1 ]?.thumbnail_url || img1;
  const [ loading, setLoading ] = useState(false)

  const { execute: addWishlist, loading: loadingWishlist, error } = useAsync(profileService.addWishlist)
  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [ error ])

  const dispatch = useDispatch()
  const addProduct = () => {
    setLoading(true)
    dispatch(addCartAction({
      id,
      success: () => {
        message.success(`Thêm sản phẩm ${name} thành công!`)
      },
      finally: () => {
        setLoading(false)
      }
    }))
  }

  const onAddWishlist = async () => {
    try {
      await addWishlist(id)
      message.success(`Thêm sản phẩm ${name} trong wishlist thành công!`)
    }
    catch (err) {
    }
  }

  return (
    <div className="col-6 col-md-4">
      {/* Card */ }
      <div className="card mb-7">
        {/* Badge */ }
        <div className="badge badge-white card-badge card-badge-left text-uppercase">
          New
        </div>
        {/* Image */ }
        <div className="card-img">
          {/* Image */ }
          <a className="card-img-hover" href="product.html">
            <img className="card-img-top card-img-back" src={ img1 } alt="..." />
            <img className="card-img-top card-img-front" src={ img2 } alt="..." />
          </a>
          {/* Actions */ }
          <div className="card-actions">
            <span className="card-action">
              <button
                className="btn btn-xs btn-circle btn-white-primary"
                data-toggle="modal"
                data-target="#modalProduct">
                <i className="fe fe-eye" />
              </button>
            </span>
            <span className="card-action">
              {
                loading ? <Spin /> : <button onClick={ addProduct }
                  className="btn btn-xs btn-circle btn-white-primary"
                  data-toggle="button">
                  <i className="fe fe-shopping-cart" />
                </button>
              }
            </span>
            <span className="card-action">
              {
                loadingWishlist ? <Spin /> : <button onClick={ onAddWishlist }
                  className="btn btn-xs btn-circle btn-white-primary"
                  data-toggle="button">
                  <i className="fe fe-heart" />
                </button>
              }

            </span>
          </div>
        </div>
        {/* Body */ }
        <div className="card-body px-0">
          {/* Category */ }
          <div className="font-size-xs">
            <a className="text-muted" href="shop.html">
              Shoes
            </a>
          </div>
          {/* Title */ }
          <div className="font-weight-bold">
            <a className="text-body" href="product.html">
              { name }
            </a>
          </div>
          {/* Price */ }


          {
            real_price < price ? <>
              <span className="font-weight-bold" style={ { color: 'red', marginRight: 7, fontSize: 21 } }>
                { currency(real_price) }đ
              </span>
              <span className="font-weight-bold text-muted" style={ { textDecoration: 'line-through' } }>
                { currency(price) }đ
              </span>
            </>
              : <>
                <span className="font-weight-bold text-muted" style={ { textDecoration: 'none' } }>
                  { currency(price) }đ
                </span>
              </>
          }
        </div>
      </div>
    </div>
  );
}
