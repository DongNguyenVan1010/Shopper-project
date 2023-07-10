import React from 'react'
import { generatePath, Link } from 'react-router-dom'
import Paginate from '../../../component/Paginate'
import { path } from '../../../config/path'
import { useCurrentPage, useQuery } from '../../../core'
import orderService from '../../../service/order.service'
import { currency } from '../../../utils/currency'

export default function Order() {

    const currentPage = useCurrentPage()
    const { data, paginate, loading } = useQuery(() => orderService.getList(`?page=${currentPage}`), [ currentPage ])
    console.log('paginate', paginate)
    const renderImage = (listItems) => {
        const list = []
        if (listItems.length >= 5) {
            for (let i = 0; i < 3; i++) {
                const item = listItems[ i ]
                list.push(<div className="col-3">
                    <div className="embed-responsive embed-responsive-1by1 bg-cover" style={ { backgroundImage: `url(${item.product.images?.[ 0 ].thumbnail_url})` } } />
                </div>)
            }
            list.push(<div className="col-3">
                {/* Image */ }
                <div className="embed-responsive embed-responsive-1by1 bg-light">
                    <a className="embed-responsive-item embed-responsive-item-text text-reset" href="#!">
                        <div className="font-size-xxs font-weight-bold">
                            + { listItems.length - 3 } <br /> more
                        </div>
                    </a>
                </div>
            </div>
            )
        }

        else {
            for (let item of listItems) {
                list.push(<div className="col-3">
                    <div className="embed-responsive embed-responsive-1by1 bg-cover" style={ { backgroundImage: `url(${item.product.images?.[ 0 ].thumbnail_url})` } } />
                </div>)
            }
        }
        return list
    }

    return (
        <>
            <div>
                {
                    data?.map?.(ev => (
                        <div key={ ev._id } className="card card-lg mb-5 border">
                            <div className="card-body pb-0">
                                {/* Info */ }
                                <div className="card card-sm">
                                    <div className="card-body bg-light">
                                        <div className="row">
                                            <div className="col-6 col-lg-3">
                                                {/* Heading */ }
                                                <h6 className="heading-xxxs text-muted">Order No:</h6>
                                                {/* Text */ }
                                                <p className="mb-lg-0 font-size-sm font-weight-bold">
                                                    { ev._id }
                                                </p>
                                            </div>
                                            <div className="col-6 col-lg-3">
                                                {/* Heading */ }
                                                <h6 className="heading-xxxs text-muted">Shipped date:</h6>
                                                {/* Text */ }
                                                <p className="mb-lg-0 font-size-sm font-weight-bold">
                                                    <time dateTime="2019-09-07">
                                                        07 Sep, 2019
                                                    </time>
                                                </p>
                                            </div>
                                            <div className="col-6 col-lg-3">
                                                {/* Heading */ }
                                                <h6 className="heading-xxxs text-muted">Status:</h6>
                                                {/* Text */ }
                                                <p className="mb-0 font-size-sm font-weight-bold">
                                                    Delivered
                                                </p>
                                            </div>
                                            <div className="col-6 col-lg-3">
                                                {/* Heading */ }
                                                <h6 className="heading-xxxs text-muted">Order Amount:</h6>
                                                {/* Text */ }
                                                <p className="mb-0 font-size-sm font-weight-bold">
                                                    { currency(ev.total) } vnđ
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="row align-items-center">
                                    <div className="col-12 col-lg-6">
                                        <div className="form-row mb-4 mb-lg-0">
                                            { renderImage(ev.listItems) }
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="form-row">
                                            <div className="col-6">
                                                {/* Button */ }
                                                <Link className="btn btn-sm btn-block btn-outline-dark" to={ generatePath(path.Account.MyOrderDetail, { id: ev._id }) }>
                                                    Order Details
                                                </Link>
                                            </div>
                                            <div className="col-6">
                                                {/* Button */ }
                                                <a className="btn btn-sm btn-block btn-outline-dark" href="#!">
                                                    Track order
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                    )
                }
                {/* Pagination */ }
                <Paginate totalPage={ paginate.totalPage } />
            </div>

        </>
    )
}
