import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath, Navigate, useNavigate } from 'react-router-dom'
import Button from '../component/Button'
import CartItem from '../component/CartItem'
import Input from '../component/Input'
import TotalBill from '../component/TotalBill'
import ViewCartItem from '../component/ViewCartItem'
import { path } from '../config/path'
import { useAsync, useForm, useQuery } from '../core'
import { useAuth } from '../core/hooks/useAuth'
import { useCart } from '../hooks/useCart'
import cartService from '../service/cart.service'
import profileService from '../service/profile.service'
import { getCartAction } from '../store/cartReducer'


export default function Checkout() {

    const { cart } = useCart()
    const navigate = useNavigate()
    const { data: address } = useQuery(() => profileService.getAddress())
    const { execute: checkout, loading, error: errCheckout } = useAsync(cartService.checkout)
    const { execute: changeShippingMethod, loading: loadPreCheckout, error: errPreCheckout } = useAsync(cartService.precheckout)
    const [ shipping, setShipping ] = useState('tieu-chuan')
    const { user } = useAuth()
    // console.log('cart', cart)
    // console.log('address', address)
    const dispatch = useDispatch()
    const { form, setForm, validate, error, register } = useForm({
        fullName: [
            { required: true }
        ],
        email: [
            { required: true },
            { regexp: 'email' }
        ],
        phone: [
            { required: true },
            { regexp: 'phone' }
        ],
        province: [
            { required: true },
        ],
        district: [
            { required: true },
        ],
        address: [
            { required: true },

        ]
    })

    useEffect(() => {
        if (address) {
            setForm(address)

        }

    }, [ address ])

    const onSubmit = async () => {
        if (validate()) {
            const res = await (checkout({
                'shippingMethod': cart?.shippingMethod,
                'paymentMethod': cart?.paymentMethod,
                'shipping': form,
                'note': form.note
            }))
            navigate(generatePath(path.OrderCompleted, { id: res.data._id }))
            // console.log('cart', cart)
        }
    }
    useEffect(() => {

        onChangeShippingMethod(shipping)
    }, [])

    const onChangeShippingMethod = async (method) => {
        setShipping(method)
        await changeShippingMethod({ shippingMethod: method })
        dispatch(getCartAction())
    }

    if (!user) {
        return <Navigate to={ path.Auth } />
    }

    if (cart?.totalQuantity === 0) {
        return <Navigate to={ path.Shop } />
    }

    return (
        <>
            <section className="pt-7 pb-12">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            {/* Heading */ }
                            <h3 className="mb-4">Checkout</h3>
                            {/* Subheading */ }
                            <p className="mb-10">
                                Already have an account? <a className="font-weight-bold text-reset" href="#!">Click here to login</a>
                            </p>
                            <p style={ { color: 'red' } }>{ errCheckout }</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-7">
                            {/* Form */ }
                            <form>
                                {/* Heading */ }
                                <h6 className="mb-7">Billing Details</h6>
                                {/* Billing details */ }
                                <div className="row mb-9">
                                    <div className="col-12 col-md-12">
                                        <Input
                                            name='name'
                                            label='Full Name *'
                                            placeholder='Full Name'
                                            { ...register('fullName') }
                                        />
                                    </div>

                                    <div className="col-12">
                                        {/* Email */ }
                                        <Input
                                            name='email'
                                            label='Email *'
                                            placeholder='Email'
                                            { ...register('email') }
                                        />
                                    </div>
                                    <div className="col-12 ">
                                        <Input
                                            placeholder='Address'
                                            label='Address *'
                                            { ...register('address') }
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 ">
                                        <Input
                                            placeholder='District'
                                            label='District *'
                                            { ...register('district') }
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <Input
                                            placeholder='Province / City'
                                            label='Province / City *'
                                            { ...register('province') }
                                        />
                                    </div>

                                    <div className="col-12">
                                        <Input
                                            placeholder='Number Phone'
                                            label='Number Phone *'
                                            { ...register('phone') }
                                        />
                                    </div>
                                </div>
                                {/* Heading */ }
                                <h6 className="mb-7">Shipping Details</h6>
                                {/* Shipping details */ }
                                <div className="table-responsive mb-6">
                                    <table className="table table-bordered table-sm table-hover mb-0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="custom-control custom-radio">
                                                        <input onChange={ () => onChangeShippingMethod('tieu-chuan') } checked={ shipping === 'tieu-chuan' } className="custom-control-input" id="checkoutShippingStandard" name="shipping" type="radio" />
                                                        <label className="custom-control-label text-body text-nowrap" htmlFor="checkoutShippingStandard">
                                                            Standard Shipping
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>Delivery in 3 - 5 working days</td>
                                                <td>14.000 vnđ</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="custom-control custom-radio">
                                                        <input onChange={ () => onChangeShippingMethod('giao-hang-nhanh') } checked={ shipping === 'giao-hang-nhanh' } className="custom-control-input" id="checkoutShippingExpress" name="shipping" type="radio" />
                                                        <label className="custom-control-label text-body text-nowrap" htmlFor="checkoutShippingExpress">
                                                            Express Shipping
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>Delivery in 1 - 2 working days</td>
                                                <td>35.000 vnđ</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="custom-control custom-radio">
                                                        <input onChange={ () => onChangeShippingMethod('mien-phi') } checked={ shipping === 'mien-phi' } className="custom-control-input" id="checkoutShippingFree" name="shipping" type="radio" />
                                                        <label className="custom-control-label text-body text-nowrap" htmlFor="checkoutShippingFree">
                                                            Free Shipping
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>Delivery in 5 - 7 working days</td>
                                                <td>Free</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* Address */ }

                                {/* Heading */ }
                                <h6 className="mb-7">Payment</h6>
                                {/* List group */ }
                                <div className="list-group list-group-sm mb-7">
                                    <div className="list-group-item">
                                        {/* Radio */ }
                                        <div className="custom-control custom-radio">
                                            {/* Input */ }
                                            <input className="custom-control-input" id="checkoutPaymentCard" name="payment" type="radio" data-toggle="collapse" data-action="show" data-target="#checkoutPaymentCardCollapse" />
                                            {/* Label */ }
                                            <label className="custom-control-label font-size-sm text-body text-nowrap" htmlFor="checkoutPaymentCard">
                                                Credit Card <img className="ml-2" src="/img/brands/color/cards.svg" alt="..." />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="list-group-item collapse py-0" id="checkoutPaymentCardCollapse">
                                        {/* Form */ }
                                        <div className="form-row py-5">
                                            <div className="col-12">
                                                <div className="form-group mb-4">
                                                    <label className="sr-only" htmlFor="checkoutPaymentCardNumber">Card Number</label>
                                                    <input className="form-control form-control-sm" id="checkoutPaymentCardNumber" type="text" placeholder="Card Number *" required />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group mb-4">
                                                    <label className="sr-only" htmlFor="checkoutPaymentCardName">Name on Card</label>
                                                    <input className="form-control form-control-sm" id="checkoutPaymentCardName" type="text" placeholder="Name on Card *" required />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="form-group mb-md-0">
                                                    <label className="sr-only" htmlFor="checkoutPaymentMonth">Month</label>
                                                    <select className="custom-select custom-select-sm" id="checkoutPaymentMonth">
                                                        <option>January</option>
                                                        <option>February</option>
                                                        <option>March</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="form-group mb-md-0">
                                                    <label className="sr-only" htmlFor="checkoutPaymentCardYear">Year</label>
                                                    <select className="custom-select custom-select-sm" id="checkoutPaymentCardYear">
                                                        <option>2017</option>
                                                        <option>2018</option>
                                                        <option>2019</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="input-group input-group-merge">
                                                    <input className="form-control form-control-sm" id="checkoutPaymentCardCVV" type="text" placeholder="CVV *" required />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text" data-toggle="popover" data-placement="top" data-trigger="hover" data-content="The CVV Number on your credit card or debit card is a 3 digit number on VISA, MasterCard and Discover branded credit and debit cards.">
                                                            <i className="fe fe-help-circle" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-group-item">
                                        {/* Radio */ }
                                        <div className="custom-control custom-radio">
                                            {/* Input */ }
                                            <input className="custom-control-input" id="checkoutPaymentPaypal" name="payment" type="radio" data-toggle="collapse" data-action="hide" data-target="#checkoutPaymentCardCollapse" />
                                            {/* Label */ }
                                            <label className="custom-control-label font-size-sm text-body text-nowrap" htmlFor="checkoutPaymentPaypal">
                                                <img src="/img/brands/color/paypal.svg" alt="..." />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* Notes */ }
                                <textarea { ...register('note') } className="form-control form-control-sm mb-9 mb-md-0 font-size-xs" rows={ 5 } placeholder="Order Notes (optional)" defaultValue={ "" } />
                            </form>
                        </div>
                        <div className="col-12 col-md-5 col-lg-4 offset-lg-1">
                            {/* Heading */ }
                            <h6 className="mb-7">Order Items ({ cart?.totalQuantity })</h6>
                            {/* Divider */ }
                            <hr className="my-7" />
                            {/* List group */ }
                            <ul className="list-group list-group-lg list-group-flush-y list-group-flush-x mb-7">
                                {
                                    cart?.listItems?.map(ev => <CartItem key={ ev.id } { ...ev } />)
                                }
                            </ul>
                            {/* Card */ }
                            <TotalBill showShipping showTax />
                            {/* Disclaimer */ }
                            <p className="mb-7 font-size-xs text-gray-500">
                                Your personal data will be used to process your order, support
                                your experience throughout this website, and for other purposes
                                described in our privacy policy.
                            </p>
                            {/* Button */ }
                            <button loading={ loading } onClick={ onSubmit } className="btn btn-block btn-dark">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
