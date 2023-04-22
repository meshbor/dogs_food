import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { findLike } from '../../utils/utils';
import './card.css';
import { ReactComponent as Like } from './like.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
   fetchChangeLikeProduct,
   fetchDeleteProducts,
} from '../../storageToolkit/products/productsSlice';
import { ReactComponent as Basket } from '../Product/img/basket.svg';
import { openNotification } from '../Notification/Notification';

export const Card = ({ product, pictures, name, wight, price, discount, setBasketCounter }) => {
   const currentUser = useSelector((state) => state.user.data);
   const [isAdded, setIsAdded] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const isLiked = findLike(product, currentUser);
   const handleLikeClick = () => {
      dispatch(fetchChangeLikeProduct(product));
   };

   const onClickToCart = () => {
      setIsAdded((state) => !state);
   };
   console.log(isAdded);

   const deleteCard = async (id) => {
      try {
         dispatch(fetchDeleteProducts(id));
         navigate('/catalog');
         openNotification('success', 'Успешно!', 'Ваш товар успешно удален');
      } catch (error) {
         openNotification('error', 'Ошибка!', 'Ваш товар не был удален');
      }
   };

   return (
      <div className="card">
         <div className="card__sticky card__sticky_top-left">
            {!!discount && <span className="card__discount">{discount}%</span>}
         </div>
         <div className="card__sticky card__sticky_top-right">
            <button
               className={`card__favorite ${
                  isLiked ? 'card__favorite_active' : 'card__favorite_active-none'
               }`}
               onClick={handleLikeClick}
            >
               <Like className="card__liked" />
            </button>
         </div>
         <Link to={`/product/${product._id}`} className="card__link">
            <div className="card__body">
               <img src={pictures} alt="карточка товара" className="card__image" />
            </div>
            <div className="card__description">
               <span className="card__price">{price} ₽</span>
               <span className="card__wight">{wight}</span>
               <p className="card__name">{name}</p>
            </div>
         </Link>
         <div className="card__buttons">
            <span
               onClick={onClickToCart}
               className={`btn btn_type_primary ${
                  isAdded ? 'btn_type_primary-active' : 'btn_type_primary'
               }`}
            >
               {isAdded ? 'В корзине' : 'В корзину'}
            </span>
            {currentUser._id === product.author._id && (
               <Basket onClick={() => deleteCard(product._id)} className="card__basket" />
            )}
         </div>
      </div>
   );
};
